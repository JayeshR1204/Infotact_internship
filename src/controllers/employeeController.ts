import { Request, Response } from "express";
import Employee from "../models/Employee";
import {
    getEmployeeDetails,
    getEmployeeCountByDepartment,
} from "../services/employeeAggregation";

/**
 * Get all employees with related details
 */
export const fetchEmployees = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const employees = await getEmployeeDetails();

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch employees.",
        });
    }
};

/**
 * Create a new employee
 */
export const createEmployee = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const employee = await Employee.create(req.body);

        res.status(201).json({
            success: true,
            message: "Employee created successfully.",
            data: employee,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unable to create employee.",
        });
    }
};

/**
 * Department-wise employee count
 */
export const employeeCountReport = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const report = await getEmployeeCountByDepartment();

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to generate report.",
        });
    }
};
