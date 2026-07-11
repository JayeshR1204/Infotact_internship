import Employee from "../models/Employee";

export const getEmployeeDetails = async () => {
    return Employee.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
            },
        },

        {
            $lookup: {
                from: "departments",
                localField: "department",
                foreignField: "_id",
                as: "department",
            },
        },

        {
            $lookup: {
                from: "payrolls",
                localField: "_id",
                foreignField: "employee",
                as: "payroll",
            },
        },

        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true,
            },
        },

        {
            $unwind: {
                path: "$department",
                preserveNullAndEmptyArrays: true,
            },
        },

        {
            $project: {
                employeeId: 1,
                designation: 1,
                salary: 1,
                status: 1,
                joiningDate: 1,

                "user.name": 1,
                "user.email": 1,
                "user.role": 1,

                "department.departmentName": 1,
                "department.departmentCode": 1,

                payroll: 1,
            },
        },
    ]);
};