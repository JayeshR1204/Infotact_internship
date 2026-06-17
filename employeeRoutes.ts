import { Router, Response } from 'express';
import { protectRoute, authorizeRoles, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { UserRole } from '../models/User.js';
import { Employee } from '../models/Employee.js';

const router = Router();

/**
 * @route   POST /api/employees
 * @desc    Create a new employee workforce record
 * @access  Private (Admin and HR Manager only)
 */
router.post(
    '/',
    protectRoute,
    authorizeRoles(UserRole.ADMIN, UserRole.HR_MANAGER),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { userId, employeeId, position, salary, status } = req.body;

            // Validate that the profile doesn't already exist
            const existingEmp = await Employee.findOne({ employeeId });
            if (existingEmp) {
                res.status(400).json({ success: false, message: 'Employee ID already registered.' });
                return;
            }

            const newEmployee = new Employee({
                userId,
                employeeId,
                position,
                salary,
                status
            });

            await newEmployee.save();

            res.status(201).json({
                success: true,
                message: 'Employee workforce profile recorded successfully.',
                data: newEmployee
            });
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    }
);
/**
 * @route   GET /api/employees
 * @desc    Fetch all employee records with User Account Details populated
 * @access  Private (Admin and HR Manager only)
 */
router.get(
    '/',
    protectRoute,
    authorizeRoles(UserRole.ADMIN, UserRole.HR_MANAGER),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            // Fulfills complex data relationship lookups by populating referenced user accounts
            const employees = await Employee.find().populate('userId', 'name email role department');
            
            res.json({
                success: true,
                count: employees.length,
                data: employees
            });
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    }
);

export default router;
