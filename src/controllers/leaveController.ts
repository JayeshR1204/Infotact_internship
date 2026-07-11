import { Request, Response } from "express";
import LeaveRequest from "../models/LeaveRequest";

/**
 * Create leave request
 */
export const createLeaveRequest = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const leave = await LeaveRequest.create(req.body);

        res.status(201).json({
            success: true,
            message: "Leave request submitted successfully.",
            data: leave,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unable to submit leave request.",
        });
    }
};

/**
 * Get all leave requests
 */
export const getLeaveRequests = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const leaves = await LeaveRequest.find()
            .populate("employee")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch leave requests.",
        });
    }
};
