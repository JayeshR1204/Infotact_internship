import { Router, Response } from 'express';
import { protectRoute, authorizeRoles, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { UserRole } from '../models/User.js';
import { Payroll } from '../models/Payroll.js';
import { Employee } from '../models/Employee.js';

const router = Router();

/**
 * @route   POST /api/payroll/calculate
 * @desc    Generate and calculate a monthly payroll sheet entry for an employee
 * @access  Private (Admin and HR Manager only)
 */
router.post(
    '/calculate',
    protectRoute,
    authorizeRoles(UserRole.ADMIN, UserRole.HR_MANAGER),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { employeeId, payPeriod, allowances, deductions } = req.body;

            // 1. Fetch employee to verify base salary records
            const employee = await Employee.findById(employeeId);
            if (!employee) {
                res.status(404).json({ success: false, message: 'Employee profile context not found.' });
                return;
            }

            // 2. Perform automated ledger financial mathematics
            const baseSalary = employee.salary;
            const calculatedNetPay = baseSalary + (allowances || 0) - (deductions || 0);

            if (calculatedNetPay < 0) {
                res.status(400).json({ success: false, message: 'Deductions cannot exceed total gross earnings.' });
                return;
            }

            // 3. Save or update the payroll document
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
 * @route   GET /api/payroll/history/:employeeId
 * @desc    Fetch financial disbursement history for a specific worker profile
 * @access  Private (Accessible by Admin, HR, or the specific logged-in Employee)
 */
router.get(
    '/history/:employeeId',
    protectRoute,
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { employeeId } = req.params;

            // Enforce role isolation: Employees can only view their own payroll records
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
