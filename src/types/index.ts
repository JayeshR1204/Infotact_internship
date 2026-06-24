import { Types } from "mongoose";

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
    phone: string;
    address: string;
}
