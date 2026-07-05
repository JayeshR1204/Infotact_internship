/**
 * seed.js — Database Seeder Script
 * Run with: node seed.js
 * Seeds the database with an Admin, an HR Manager, and 3 Employee accounts.
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hrms';

// ─── Inline Schemas (mirrors models exactly) ─────────────────────────────────
const userSchema = new mongoose.Schema({
    name:         { type: String, required: true },
    email:        { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role:         { type: String, enum: ['Admin', 'HR Manager', 'Employee'], default: 'Employee' },
    department:   { type: String, default: 'General Operations' },
    createdAt:    { type: Date, default: Date.now }
});

const employeeSchema = new mongoose.Schema({
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    employeeId:  { type: String, required: true, unique: true },
    position:    { type: String, required: true },
    salary:      { type: Number, required: true },
    joiningDate: { type: Date, default: Date.now },
    status:      { type: String, enum: ['Active', 'On Leave', 'Terminated'], default: 'Active' }
}, { timestamps: true });

const UserModel    = mongoose.model('User', userSchema);
const EmployeeModel = mongoose.model('Employee', employeeSchema);

const SALT_ROUNDS = 12;

const seedData = [
    {
        user: { name: 'Super Admin', email: 'admin@infotact.com', password: 'Admin@2026!', role: 'Admin', department: 'Executive Management' },
        employee: null
    },
    {
        user: { name: 'Priya Sharma', email: 'priya.hr@infotact.com', password: 'Hr@2026!', role: 'HR Manager', department: 'Human Resources' },
        employee: null
    },
    {
        user: { name: 'Arjun Mehta', email: 'arjun@infotact.com', password: 'Emp@2026!', role: 'Employee', department: 'Engineering' },
        employee: { employeeId: 'EMP-2026-001', position: 'Senior Software Engineer', salary: 95000 }
    },
    {
        user: { name: 'Neha Kapoor', email: 'neha@infotact.com', password: 'Emp@2026!', role: 'Employee', department: 'Engineering' },
        employee: { employeeId: 'EMP-2026-002', position: 'Frontend Developer', salary: 78000 }
    },
    {
        user: { name: 'Rohan Verma', email: 'rohan@infotact.com', password: 'Emp@2026!', role: 'Employee', department: 'Sales & Marketing' },
        employee: { employeeId: 'EMP-2026-003', position: 'Business Development Manager', salary: 85000 }
    },
    {
        user: { name: 'Ananya Singh', email: 'ananya@infotact.com', password: 'Emp@2026!', role: 'Employee', department: 'Operations' },
        employee: { employeeId: 'EMP-2026-004', position: 'Project Coordinator', salary: 62000 }
    },
    {
        user: { name: 'Vikram Patel', email: 'vikram@infotact.com', password: 'Emp@2026!', role: 'Employee', department: 'Finance' },
        employee: { employeeId: 'EMP-2026-005', position: 'Financial Analyst', salary: 88000 }
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('🍃 Connected to MongoDB...\n');

        // Clean existing data
        await UserModel.deleteMany({});
        await EmployeeModel.deleteMany({});
        console.log('🧹 Cleared existing users and employees.\n');

        for (const entry of seedData) {
            const passwordHash = await bcrypt.hash(entry.user.password, SALT_ROUNDS);
            const savedUser = await UserModel.create({
                name:         entry.user.name,
                email:        entry.user.email,
                passwordHash,
                role:         entry.user.role,
                department:   entry.user.department
            });

            if (entry.employee) {
                await EmployeeModel.create({
                    userId:     savedUser._id,
                    employeeId: entry.employee.employeeId,
                    position:   entry.employee.position,
                    salary:     entry.employee.salary
                });
            }

            console.log(`✅ Created: [${entry.user.role}] ${entry.user.name} — ${entry.user.email} / ${entry.user.password}`);
        }

        console.log('\n╔══════════════════════════════════════════════════════════════╗');
        console.log('║         🎉 DATABASE SEEDED SUCCESSFULLY! 🎉                  ║');
        console.log('╠══════════════════════════════════════════════════════════════╣');
        console.log('║ ADMIN:    admin@infotact.com         / Admin@2026!           ║');
        console.log('║ HR MGR:   priya.hr@infotact.com      / Hr@2026!              ║');
        console.log('║ EMPLOYEE: arjun@infotact.com         / Emp@2026!             ║');
        console.log('║ EMPLOYEE: neha@infotact.com          / Emp@2026!             ║');
        console.log('║ EMPLOYEE: rohan@infotact.com         / Emp@2026!             ║');
        console.log('║ EMPLOYEE: ananya@infotact.com        / Emp@2026!             ║');
        console.log('║ EMPLOYEE: vikram@infotact.com        / Emp@2026!             ║');
        console.log('╚══════════════════════════════════════════════════════════════╝\n');

    } catch (err) {
        console.error('❌ Seeding error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seed();
