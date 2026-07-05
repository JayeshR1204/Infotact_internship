import { Router } from 'express';
import { protectRoute, authorizeRoles } from '../middleware/authMiddleware.js';
import { UserRole } from '../models/User.js';
import { Employee } from '../models/Employee.js';
import { User } from '../models/User.js';
const router = Router();
// ──────────────────────────────────────────────────────────────────────────────
// GET /api/employees/profile
// @desc    Fetch the logged-in employee's own profile (used by Employee dashboard)
// @access  Private (Employee, Admin, HR Manager)
// ──────────────────────────────────────────────────────────────────────────────
router.get('/profile', protectRoute, async (req, res) => {
    try {
        const employee = await Employee.findOne({ userId: req.user?.userId })
            .populate('userId', 'name email role department');
        if (!employee) {
            res.status(404).json({ success: false, message: 'Employee profile not found for this account.' });
            return;
        }
        res.json({ success: true, data: employee });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// ──────────────────────────────────────────────────────────────────────────────
// GET /api/employees
// @desc    Fetch all employee records with populated User Account details
// @access  Private (Admin and HR Manager only)
// ──────────────────────────────────────────────────────────────────────────────
router.get('/', protectRoute, authorizeRoles(UserRole.ADMIN, UserRole.HR_MANAGER), async (_req, res) => {
    try {
        const employees = await Employee.find()
            .populate('userId', 'name email role department')
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            count: employees.length,
            data: employees
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// ──────────────────────────────────────────────────────────────────────────────
// GET /api/employees/:id
// @desc    Fetch a single employee record by their MongoDB ObjectId
// @access  Private (Admin and HR Manager only)
// ──────────────────────────────────────────────────────────────────────────────
router.get('/:id', protectRoute, authorizeRoles(UserRole.ADMIN, UserRole.HR_MANAGER), async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('userId', 'name email role department');
        if (!employee) {
            res.status(404).json({ success: false, message: 'Employee record not found.' });
            return;
        }
        res.json({ success: true, data: employee });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// ──────────────────────────────────────────────────────────────────────────────
// POST /api/employees
// @desc    Create a new employee profile and a linked User account simultaneously
// @access  Private (Admin and HR Manager only)
// ──────────────────────────────────────────────────────────────────────────────
router.post('/', protectRoute, authorizeRoles(UserRole.ADMIN, UserRole.HR_MANAGER), async (req, res) => {
    try {
        const { name, email, password, department, employeeId, position, salary, status } = req.body;
        if (!name || !email || !password || !employeeId || !position || !salary) {
            res.status(400).json({ success: false, message: 'All fields are required: name, email, password, employeeId, position, salary.' });
            return;
        }
        // Check duplicate employee ID
        const existingEmp = await Employee.findOne({ employeeId });
        if (existingEmp) {
            res.status(400).json({ success: false, message: `Employee ID '${employeeId}' is already registered.` });
            return;
        }
        // Check duplicate email
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'An account with this email already exists.' });
            return;
        }
        // Create User account
        const bcrypt = await import('bcryptjs');
        const passwordHash = await bcrypt.default.hash(password, 12);
        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            passwordHash,
            role: UserRole.EMPLOYEE,
            department: department?.trim() || 'General Operations'
        });
        const savedUser = await newUser.save();
        // Create Employee profile linked to the user
        const newEmployee = new Employee({
            userId: savedUser._id,
            employeeId: employeeId.trim(),
            position: position.trim(),
            salary: parseFloat(salary),
            status: status || 'Active'
        });
        await newEmployee.save();
        const populatedEmployee = await Employee.findById(newEmployee._id)
            .populate('userId', 'name email role department');
        res.status(201).json({
            success: true,
            message: 'Employee account and profile created successfully.',
            data: populatedEmployee
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// ──────────────────────────────────────────────────────────────────────────────
// PUT /api/employees/:id
// @desc    Update an employee's position, salary, or status
// @access  Private (Admin and HR Manager only)
// ──────────────────────────────────────────────────────────────────────────────
router.put('/:id', protectRoute, authorizeRoles(UserRole.ADMIN, UserRole.HR_MANAGER), async (req, res) => {
    try {
        const { position, salary, status, department } = req.body;
        const updateData = {};
        if (position)
            updateData.position = position.trim();
        if (salary !== undefined)
            updateData.salary = parseFloat(salary);
        if (status)
            updateData.status = status;
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true, runValidators: true }).populate('userId', 'name email role department');
        if (!updatedEmployee) {
            res.status(404).json({ success: false, message: 'Employee record not found.' });
            return;
        }
        // Update department on User document if provided
        if (department) {
            await User.findByIdAndUpdate(updatedEmployee.userId, { department: department.trim() });
        }
        res.json({ success: true, message: 'Employee record updated.', data: updatedEmployee });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// ──────────────────────────────────────────────────────────────────────────────
// DELETE /api/employees/:id
// @desc    Soft-delete: set employee status to Terminated
// @access  Private (Admin only)
// ──────────────────────────────────────────────────────────────────────────────
router.delete('/:id', protectRoute, authorizeRoles(UserRole.ADMIN), async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, { $set: { status: 'Terminated' } }, { new: true });
        if (!employee) {
            res.status(404).json({ success: false, message: 'Employee record not found.' });
            return;
        }
        res.json({ success: true, message: 'Employee has been terminated successfully.', data: employee });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
export default router;
