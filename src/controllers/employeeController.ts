import { Request, Response } from "express";
import { getEmployeeDetails } from "../services/employeeAggregation";

export const fetchEmployees = async (
    req: Request,
    res: Response
) => {

    const employees = await getEmployeeDetails();

    res.status(200).json({

        success: true,

        data: employees

    });

};