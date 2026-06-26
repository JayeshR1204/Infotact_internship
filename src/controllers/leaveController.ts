import { Request, Response } from "express";
import LeaveRequest from "../models/LeaveRequest";

export const createLeaveRequest = async (
    req: Request,
    res: Response
) => {

    const leave = await LeaveRequest.create(req.body);

    res.status(201).json(leave);

};

export const getLeaveRequests = async (
    req: Request,
    res: Response
) => {

    const leaves = await LeaveRequest.find().populate("employee");

    res.json(leaves);

};