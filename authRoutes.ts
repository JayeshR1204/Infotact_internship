import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User, UserRole } from '../models/User.js';
import { Employee } from '../models/Employee.js';
import { generateToken } from '../utils/authUtils.js';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account and auto-generate an Employee Profile slot
 * @access  Public
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role, department, position, salary } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'Email identifier already registered.' });
            return;
        }

        // 2. Hash the raw password securely (using 10 salt rounds)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Create and save the new User document
        const newUser = new User({
            name,
            email,
            passwordHash,
            role: role || UserRole.EMPLOYEE,
            department
        });
        const savedUser = await newUser.save();

        // 4. Auto-generate the associated Employee workforce record contract
        // Generates a clean template corporate ID string matching 2026 specs
        const randomIdModifier = Math.floor(1000 + Math.random() * 9000);
        const generatedEmployeeId = `EMP-2026-${randomIdModifier}`;

        const newEmployeeProfile = new Employee({
            userId: savedUser._id,
            employeeId: generatedEmployeeId,
            position: position || 'Junior Analyst Associate',
            salary: salary || 30000,
            status: 'Active'
        });
        await newEmployeeProfile.save();

        // 5. Generate secure JWT payload token for instant session onboarding
        const token = generateToken({ userId: savedUser._id as string, role: savedUser.role });

        res.status(201).json({
            success: true,
            message: 'User account and workforce profile synchronized successfully.',
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
                employeeId: generatedEmployeeId
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
});

export default router;
