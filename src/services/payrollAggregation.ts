import Payroll from "../models/Payroll";

export const generatePayrollReport = async () => {
    return Payroll.aggregate([
        {
            $lookup: {
                from: "employees",
                localField: "employee",
                foreignField: "_id",
                as: "employee",
            },
        },

        {
            $unwind: "$employee",
        },

        {
            $addFields: {
                netSalary: {
                    $subtract: [
                        {
                            $add: [
                                "$basicSalary",
                                "$allowances",
                            ],
                        },
                        "$deductions",
                    ],
                },
            },
        },

        {
            $project: {
                month: 1,
                year: 1,
                basicSalary: 1,
                allowances: 1,
                deductions: 1,
                netSalary: 1,
                employeeId: "$employee.employeeId",
                designation: "$employee.designation",
            },
        },
    ]);
};
