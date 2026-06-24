import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app: Application = express();
const PORT: number = 5000;

// Security Middleware (Required by Infotact Guidelines)
app.use(helmet()); 
app.use(cors({
    origin: 'http://localhost:5173', // Allows connections from your Vite frontend
    credentials: true
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample Base Route
app.get('/', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: "Enterprise HRMS & Payroll API is running successfully."
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 HRMS Server running securely on http://localhost:${PORT}`);
});
