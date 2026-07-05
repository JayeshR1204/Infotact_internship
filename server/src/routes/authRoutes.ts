import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, UserRole, IUser } from '../models/User.js';
import { Employee } from '../models/Employee.js';
import { generateToken } from '../utils/authUtils.js';

const router = Router();

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// @desc    Register a new user and optionally create their employee profile
// @access  Public (in production, protect this behind an Admin gate)
// ──────────────────────────────────────────────────────────────────────────────
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role, department, employeeId, position, salary } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
            return;
        }

        // Check for duplicate accounts
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(409).json({ success: false, message: 'An account with this email already exists.' });
            return;
        }

        // Validate role assignment
        const assignedRole: UserRole = (Object.values(UserRole) as string[]).includes(role)
            ? (role as UserRole)
            : UserRole.EMPLOYEE;

        // Securely hash password with bcrypt (salt rounds = 12)
        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            passwordHash,
            role: assignedRole,
            department: department?.trim() || 'General Operations'
        });

        const savedUser = await newUser.save();

        // Auto-create employee profile if employee-specific data is provided
        if (assignedRole === UserRole.EMPLOYEE && employeeId && position && salary) {
            const newEmployee = new Employee({
                userId: savedUser._id,
                employeeId: employeeId.trim(),
                position: position.trim(),
                salary: parseFloat(salary)
            });
            await newEmployee.save();
        }

        // Generate signed JWT
        const token = generateToken({ userId: savedUser._id.toString(), role: assignedRole });

        res.status(201).json({
            success: true,
            message: 'Account created successfully.',
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
                department: savedUser.department
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: (error as Error).message });
    }
});

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// @desc    Authenticate user and return signed JWT
// @access  Public
// ──────────────────────────────────────────────────────────────────────────────
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required.' });
            return;
        }

        // Fetch user — explicitly select passwordHash since it is hidden by default
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');

        if (!user) {
            // Use generic message to prevent user enumeration attacks
            res.status(401).json({ success: false, message: 'Invalid email or password.' });
            return;
        }

        // Constant-time bcrypt comparison
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({ success: false, message: 'Invalid email or password.' });
            return;
        }

        // Attempt to find associated employee profile (only relevant for Employee role)
        let employeeId: string | undefined;
        let employeeObjectId: string | undefined;
        if (user.role === UserRole.EMPLOYEE) {
            const empProfile = await Employee.findOne({ userId: user._id }).lean();
            if (empProfile) {
                employeeId = empProfile.employeeId;
                employeeObjectId = (empProfile._id as { toString(): string }).toString();
            }
        }

        // Sign and issue JWT token
        const token = generateToken({ userId: user._id.toString(), role: user.role });

        res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                ...(employeeId && { employeeId }),
                ...(employeeObjectId && { employeeObjectId })
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
});

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me
// @desc    Return current user's session profile (used for session restoration)
// @access  Private
// ──────────────────────────────────────────────────────────────────────────────
import { protectRoute, AuthenticatedRequest } from '../middleware/authMiddleware.js';

router.get('/me', protectRoute, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?.userId).lean() as IUser | null;
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found.' });
            return;
        }

        let employeeId: string | undefined;
        let employeeObjectId: string | undefined;
        if (user.role === UserRole.EMPLOYEE) {
            const emp = await Employee.findOne({ userId: user._id }).lean();
            if (emp) {
                employeeId = emp.employeeId;
                employeeObjectId = (emp._id as { toString(): string }).toString();
            }
        }

        res.json({
            success: true,
            user: {
                id: (user._id as { toString(): string }).toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                ...(employeeId && { employeeId }),
                ...(employeeObjectId && { employeeObjectId })
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
});

export default router;
