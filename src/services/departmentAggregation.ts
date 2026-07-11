import Department from "../models/Department";

export const getDepartmentHierarchy = async () => {
    return Department.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "manager",
                foreignField: "_id",
                as: "manager",
            },
        },

        {
            $unwind: {
                path: "$manager",
                preserveNullAndEmptyArrays: true,
            },
        },

        {
            $project: {
                departmentName: 1,
                departmentCode: 1,
                managerName: "$manager.name",
                managerEmail: "$manager.email",
            },
        },
    ]);
};
