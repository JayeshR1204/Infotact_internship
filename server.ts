import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './db.js';
import { generateToken } from './utils/authUtils.js';
import { protectRoute, authorizeRoles, AuthenticatedRequest } from './middleware/authMiddleware.js'; // <-- Import middleware
import { UserRole } from './models/User.js'; // <-- Import your roles enum

const app: Application = express();
const PORT: number = 5000;

// Connect to MongoDB
connectDB();
// Security Middleware
app.use(helmet()); 
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base Route
app.get('/', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: "Enterprise HRMS & Payroll API is running successfully."
    });
});
// Mock Login Route
app.post('/api/auth/mock-login', (req: Request, res: Response) => {
    const mockUser = {
        id: "65f8a2b3c9e1b23456789abc",
        role: "HR Manager" 
    };

    const token = generateToken({ userId: mockUser.id, role: mockUser.role });

    res.json({
        success: true,
        message: "Authentication successful (Mock)",
        token: token
    });
});

// PROTECTED ROUTE: Only accessible by HR Managers or Admins via valid JWT
app.get(
    '/api/hrms/admin-dashboard', 
    protectRoute, 
    authorizeRoles(UserRole.ADMIN, UserRole.HR_MANAGER), 
    (req: AuthenticatedRequest, res: Response) => {
        res.json({
            success: true,
            message: "Welcome to the Secured HR Payroll Dashboard Metrics.",
            requestedBy: req.user
        });
});
app.listen(PORT, () => {
    console.log(`HRMS Server running securely on http://localhost:${PORT}`);
});
