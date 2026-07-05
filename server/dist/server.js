import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';
import connectDB from './config/db.js';
dotenv.config();
const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
// Connect to MongoDB
connectDB();
// ─── Security Middleware ────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
// ─── Rate Limiting (Brute-force protection) ─────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' }
});
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' }
});
app.use(globalLimiter);
// ─── Body Parsers ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/payroll', payrollRoutes);
// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'Enterprise HRMS & Payroll API is running.',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error.' });
});
app.listen(PORT, () => {
    console.log(`🚀 HRMS Server running on http://localhost:${PORT}`);
});
export default app;
