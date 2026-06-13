import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './db.js';
import { generateToken } from './utils/authUtils.js'; // <-- Import your new utility

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

// Mock Login Route to verify JWT Token Generation contribution
app.post('/api/auth/mock-login', (req: Request, res: Response) => {
    // Simulated valid user details for proof of concept
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

app.listen(PORT, () => {
    console.log(`HRMS Server running securely on http://localhost:${PORT}`);
});
