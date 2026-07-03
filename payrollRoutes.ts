import { Router, Response } from 'express';
import { protectRoute, authorizeRoles, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { UserRole } from '../models/User.js';
import { Payroll } from '../models/Payroll.js';
import { Employee } from '../models/Employee.js';
import { generatePayslipPayload } from '../utils/pdfGenerator.js'; // <-- Import the new PDF payload builder

const router = Router();

/**
 * @route   POST /api/payroll/calculate
 * @desc    Generate and calculate a monthly payroll sheet entry for an employee
 */
router.post(
    '/calculate',
    protectRoute,
    authorizeRoles(UserRole.ADMIN, UserRole.HR_MANAGER),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { employeeId, payPeriod, allowances, deductions } = req.body;

            const employee = await Employee.findById(employeeId);
            if (!employee) {
                res.status(404).json({ success: false, message: 'Employee profile context not found.' });
                return;
            }

            const baseSalary = employee.salary;
            const calculatedNetPay = baseSalary + (allowances || 0) - (deductions || 0);

            if (calculatedNetPay < 0) {
                res.status(400).json({ success: false, message: 'Deductions cannot exceed total gross earnings.' });
                return;
            }

            const payrollReceipt = new Payroll({
                employeeId,
                payPeriod,
                baseSalary,
                allowances: allowances || 0,
                deductions: deductions || 0,
                netPay: calculatedNetPay,
                status: 'Processed',
                processedAt: new Date()
            });

            await payrollReceipt.save();

            res.status(201).json({
                success: true,
                message: `Payroll calculations for period ${payPeriod} compiled successfully.`,
                data: payrollReceipt
            });
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    }
);

/**
 * @route   GET /api/payroll/download/:payrollId
 * @desc    Compile and download official audited payroll receipt payload
 * @access  Private (Accessible by Admin, HR, or the specific resource owner)
 */
router.get(
    '/download/:payrollId',
    protectRoute,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { payrollId } = req.params;

            const payrollRecord = await Payroll.findById(payrollId);
            if (!payrollRecord) {
                res.status(404).json({ success: false, message: 'Payroll distribution record matching ID not found.' });
                return;
            }

            const employee = await Employee.findById(payrollRecord.employeeId);
            if (!employee) {
                res.status(404).json({ success: false, message: 'Associated employee record missing.' });
                return;
            }

            // Role enforcement boundary isolation: Ensure employees cannot harvest other profiles' payloads
            if (req.user?.role === UserRole.EMPLOYEE) {
                if (employee.userId.toString() !== req.user.userId) {
                    res.status(403).json({ success: false, message: 'Access Denied: Resource isolation cross-read blocked.' });
                    return;
                }
            }

            const generatedDocument = generatePayslipPayload(payrollRecord, employee);

            res.json({
                success: true,
                message: "PDF Data Payload compiled successfully.",
                document: generatedDocument
            });
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    }
);

/**
 * @route   GET /api/payroll/history/:employeeId
 * @desc    Fetch financial disbursement history for a specific worker profile
 */
router.get(
    '/history/:employeeId',
    protectRoute,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { employeeId } = req.params;

            if (req.user?.role === UserRole.EMPLOYEE) {
                const verifiedProfile = await Employee.findOne({ userId: req.user.userId });
                if (!verifiedProfile || verifiedProfile._id.toString() !== employeeId) {
                    res.status(403).json({ success: false, message: 'Access Denied: Cannot view external financial profiles.' });
                    return;
                }
            }

            const history = await Payroll.find({ employeeId }).sort({ payPeriod: -1 });
            
            res.json({
                success: true,
                count: history.length,
                data: history
            });
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    }
);

export default router;
