import Payroll from "../models/Payroll";

export const validatePayrollRecord = async (
    employeeId: string,
    month: string,
    year: number
) => {

    const existingPayroll = await Payroll.findOne({
        employee: employeeId,
        month,
        year
    });

    if (existingPayroll) {
        throw new Error(
            "Payroll record already exists for this employee."
        );
    }

    return true;
};