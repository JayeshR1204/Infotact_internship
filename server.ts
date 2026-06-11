import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './db.js'; // <-- Import the database layer

const app: Application = express();
const PORT: number = 5000;

// Connect to MongoDB
connectDB(); // <-- Invoke connection safely here

// Security Middleware
app.use(helmet()); 
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: "Enterprise HRMS & Payroll API is running successfully."
    });
});

app.listen(PORT, () => {
    console.log(`🚀 HRMS Server running securely on http://localhost:${PORT}`);
});
