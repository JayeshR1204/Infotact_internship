import Payroll from "../models/Payroll";

export const getPayrollExportData = async () => {

    return Payroll.aggregate([

        {
            $lookup: {
                from: "employees",
                localField: "employee",
                foreignField: "_id",
                as: "employee"
            }
        },

        {
            $unwind: "$employee"
        },

        {
            $lookup: {
                from: "users",
                localField: "employee.user",
                foreignField: "_id",
                as: "user"
            }
        },

        {
            $unwind: "$user"
        },

        {
            $project: {

                employeeId: "$employee.employeeId",

                employeeName: "$user.name",

                designation: "$employee.designation",

                month: 1,

                year: 1,

                basicSalary: 1,

                allowances: 1,

                deductions: 1,

                netSalary: {
                    $subtract: [
                        {
                            $add: [
                                "$basicSalary",
                                "$allowances"
                            ]
                        },
                        "$deductions"
                    ]
                }

            }
        }

    ]);

};