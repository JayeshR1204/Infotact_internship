import Employee from "../models/Employee";
export const getEmployeeDetails = async () => {

    return Employee.aggregate([

        {
            $lookup: {
                from: "departments",
                localField: "department",
                foreignField: "_id",
                as: "department"
            }
        },

        {
            $lookup: {
                from: "payrolls",
                localField: "_id",
                foreignField: "employee",
                as: "payroll"
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        }

    ]);

};
