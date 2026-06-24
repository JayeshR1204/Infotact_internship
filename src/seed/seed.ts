import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB from "../config/database";
import User from "../models/User";
import Department from "../models/Department";
import Employee from "../models/Employee";

dotenv.config();

const seedDatabase = async () => {
    await connectDB();

    await User.deleteMany({});
    await Department.deleteMany({});
    await Employee.deleteMany({});

    const admin = await User.create({
        name: "Admin User",
        email: "admin@hrms.com",
        password: "password123",
        role: "Admin"
    });

    const hr = await User.create({
        name: "HR Manager",
        email: "hr@hrms.com",
        password: "password123",
        role: "HR Manager"
    });

    const employeeUser = await User.create({
        name: "John Doe",
        email: "employee@hrms.com",
        password: "password123",
        role: "Employee"
    });

    const itDepartment = await Department.create({
        departmentName: "Information Technology",
        departmentCode: "IT001",
        manager: hr._id,
        description: "Handles software development"
    });

    await Employee.create({
        employeeId: "EMP001",
        user: employeeUser._id,
        department: itDepartment._id,
        designation: "Software Engineer",
        salary: 50000,
        joiningDate: new Date(),
        status: "Active",
        phone: "9876543210",
        address: "Chennai"
    });

    console.log("✅ Database seeded successfully");

    mongoose.connection.close();
};

seedDatabase();