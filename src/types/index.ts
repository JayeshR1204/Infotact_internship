import { Types } from "mongoose";

/* Existing Interfaces */

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: "Admin" | "HR Manager" | "Employee";
}

export interface IDepartment {
    departmentName: string;
    departmentCode: string;
    manager: Types.ObjectId;
    description?: string;
}

export interface IEmployee {
    employeeId: string;
    user: Types.ObjectId;
    department: Types.ObjectId;
    designation: string;
    salary: number;
    joiningDate: Date;
    status: "Active" | "Inactive";
    phone?: string;
    address?: string;
}

/* New Week 2 Interfaces */

export interface IPayroll {
    employee: Types.ObjectId;
    basicSalary: number;
    allowances: number;
    deductions: number;
    month: string;
    year: number;
}

export interface ILeaveRequest {
    employee: Types.ObjectId;
    leaveType: "Casual" | "Sick" | "Annual";
    startDate: Date;
    endDate: Date;
    reason: string;
    status: "Pending" | "Approved" | "Rejected";
}