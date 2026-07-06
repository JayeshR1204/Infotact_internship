import mongoose, { Schema } from "mongoose";
import { EMPLOYEE_STATUS } from "../utils/constants";

const EmployeeSchema = new Schema(
    {
        employeeId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        department: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },

        designation: {
            type: String,
            required: true,
            trim: true,
        },

        salary: {
            type: Number,
            required: true,
            min: 0,
        },

        joiningDate: {
            type: Date,
            default: Date.now,
        },

        status: {
            type: String,
            enum: EMPLOYEE_STATUS,
            default: "Active",
        },

        phone: {
            type: String,
            default: "",
        },

        address: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "Employee",
    EmployeeSchema
);