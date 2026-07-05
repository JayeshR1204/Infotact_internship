import { Request, Response } from "express";

import {
    getPayrollExportData
} from "../services/payrollExport";

export const exportPayroll = async (
    req: Request,
    res: Response
) => {

    const payroll =
        await getPayrollExportData();

    res.status(200).json({

        success: true,

        total: payroll.length,

        data: payroll

    });

};