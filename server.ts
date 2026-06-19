import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './db.js';
import employeeRoutes from './routes/employeeRoutes.js';
import authRoutes from './routes/authRoutes.js'; // <-- Import the new auth routing controller

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

// Mount Domain Specific API Routers
app.use('/api/auth', authRoutes);         // <-- Attach authentication routes
app.use('/api/employees', employeeRoutes); // <-- Attach employee workflow management routes

// Base Route
app.get('/', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: "Enterprise HRMS & Payroll API is running successfully."
    });
});

app.listen(PORT, () => {
    console.log(`HRMS Server running securely on http://localhost:${PORT}`);
});
