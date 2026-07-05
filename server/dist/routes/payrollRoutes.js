import { Router } from 'express';
import { protectRoute, authorizeRoles } from '../middleware/authMiddleware.js';
import { UserRole } from '../models/User.js';
import { Payroll } from '../models/Payroll.js';
import { Employee } from '../models/Employee.js';
import { User } from '../models/User.js';
import { streamPayslipPDF } from '../utils/pdfGenerator.js';
const router = Router();
// ──────────────────────────────────────────────────────────────────────────────
// POST /api/payroll/calculate
// @desc    Generate and persist a monthly payroll record for an employee
// @access  Private (Admin, HR Manager)
// ──────────────────────────────────────────────────────────────────────────────
router.post('/calculate', protectRoute, authorizeRoles(UserRole.ADMIN, UserRole.HR_MANAGER), async (req, res) => {
    try {
        const { employeeId, payPeriod, allowances, deductions } = req.body;
        if (!employeeId || !payPeriod) {
            res.status(400).json({ success: false, message: 'employeeId and payPeriod are required.' });
            return;
        }
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            res.status(404).json({ success: false, message: 'Employee profile not found.' });
            return;
        }
        // Check for duplicate payroll for the same period
        const existingPayroll = await Payroll.findOne({ employeeId, payPeriod });
        if (existingPayroll) {
            res.status(409).json({
                success: false,
                message: `Payroll for employee ${employee.employeeId} for period ${payPeriod} has already been processed.`
            });
            return;
        }
        const baseSalary = employee.salary;
        const parsedAllowances = parseFloat(allowances) || 0;
        const parsedDeductions = parseFloat(deductions) || 0;
        const calculatedNetPay = baseSalary + parsedAllowances - parsedDeductions;
        if (calculatedNetPay < 0) {
            res.status(400).json({ success: false, message: 'Deductions cannot exceed total gross earnings.' });
            return;
        }
        const payrollRecord = new Payroll({
            employeeId,
            payPeriod,
            baseSalary,
            allowances: parsedAllowances,
            deductions: parsedDeductions,
            netPay: calculatedNetPay,
            status: 'Processed',
            processedAt: new Date()
        });
        await payrollRecord.save();
        res.status(201).json({
            success: true,
            message: `Payroll for period ${payPeriod} processed successfully.`,
            data: payrollRecord
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// ──────────────────────────────────────────────────────────────────────────────
// GET /api/payroll/all
// @desc    Fetch all payroll records with populated employee details (Admin/HR)
// @access  Private (Admin, HR Manager)
// ──────────────────────────────────────────────────────────────────────────────
router.get('/all', protectRoute, authorizeRoles(UserRole.ADMIN, UserRole.HR_MANAGER), async (_req, res) => {
    try {
        const payrolls = await Payroll.find()
            .populate({
            path: 'employeeId',
            populate: { path: 'userId', select: 'name email department' }
        })
            .sort({ processedAt: -1 });
        res.json({ success: true, count: payrolls.length, data: payrolls });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// ──────────────────────────────────────────────────────────────────────────────
// GET /api/payroll/history/:employeeId
// @desc    Fetch payroll history for a specific employee
// @access  Private (Admin/HR can view any; Employee can only view their own)
// ──────────────────────────────────────────────────────────────────────────────
router.get('/history/:employeeId', protectRoute, async (req, res) => {
    try {
        const { employeeId } = req.params;
        // Role isolation: employees can only access their own data
        if (req.user?.role === UserRole.EMPLOYEE) {
            const verifiedProfile = await Employee.findOne({ userId: req.user.userId });
            if (!verifiedProfile || verifiedProfile._id.toString() !== employeeId) {
                res.status(403).json({ success: false, message: 'Access Denied: You can only view your own payroll history.' });
                return;
            }
        }
        const history = await Payroll.find({ employeeId }).sort({ payPeriod: -1 });
        res.json({ success: true, count: history.length, data: history });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// ──────────────────────────────────────────────────────────────────────────────
// GET /api/payroll/download/:payrollId
// @desc    Stream a compiled PDF payslip for a specific payroll record
// @access  Private (Admin/HR can access any; Employee only their own)
// ──────────────────────────────────────────────────────────────────────────────
router.get('/download/:payrollId', protectRoute, async (req, res) => {
    try {
        const { payrollId } = req.params;
        const payrollRecord = await Payroll.findById(payrollId);
        if (!payrollRecord) {
            res.status(404).json({ success: false, message: 'Payroll record not found.' });
            return;
        }
        const employee = await Employee.findById(payrollRecord.employeeId);
        if (!employee) {
            res.status(404).json({ success: false, message: 'Associated employee profile not found.' });
            return;
        }
        // Role isolation: prevent employees from downloading other employees' payslips
        if (req.user?.role === UserRole.EMPLOYEE) {
            if (employee.userId.toString() !== req.user.userId) {
                res.status(403).json({ success: false, message: 'Access Denied: You can only download your own payslips.' });
                return;
            }
        }
        const userAccount = await User.findById(employee.userId);
        if (!userAccount) {
            res.status(404).json({ success: false, message: 'User account for this employee not found.' });
            return;
        }
        // Stream PDF directly to the response
        streamPayslipPDF(payrollRecord, employee, userAccount, res);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// ──────────────────────────────────────────────────────────────────────────────
// PATCH /api/payroll/:payrollId/status
// @desc    Update payroll status (Pending → Processed → Paid)
// @access  Private (Admin, HR Manager)
// ──────────────────────────────────────────────────────────────────────────────
router.patch('/:payrollId/status', protectRoute, authorizeRoles(UserRole.ADMIN, UserRole.HR_MANAGER), async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Processed', 'Paid'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
            return;
        }
        const updated = await Payroll.findByIdAndUpdate(req.params.payrollId, { $set: { status, ...(status === 'Paid' ? { processedAt: new Date() } : {}) } }, { new: true });
        if (!updated) {
            res.status(404).json({ success: false, message: 'Payroll record not found.' });
            return;
        }
        res.json({ success: true, message: `Payroll status updated to '${status}'.`, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
export default router;
