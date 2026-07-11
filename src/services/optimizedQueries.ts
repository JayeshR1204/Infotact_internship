import Employee from "../models/Employee";

export const getActiveEmployees = async () => {
    return Employee.find(
        { status: "Active" }
    )
        .select(
            "employeeId designation department"
        )
        .populate(
            "department",
            "departmentName departmentCode"
        )
        .lean();
};