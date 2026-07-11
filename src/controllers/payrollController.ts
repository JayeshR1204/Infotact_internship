import { Request, Response } from "express";
import Payroll from "../models/Payroll";

/**
 * Create payroll
 */
export const createPayroll = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const payroll = await Payroll.create(req.body);

        res.status(201).json({
            success: true,
            message: "Payroll created successfully.",
            data: payroll,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unable to create payroll.",
        });
    }
};

/**
 * Get all payroll records
 */
export const getPayrolls = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const payrolls = await Payroll.find()
            .populate("employee")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payrolls.length,
            data: payrolls,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch payroll records.",
        });
    }
};
