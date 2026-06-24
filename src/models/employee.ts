import mongoose, { Schema } from "mongoose";
const EmployeeSchema = new Schema(
    {
        employeeId: {
            type: String,
            required: true,
            unique: true
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        department: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },

        designation: {
            type: String,
            required: true
        },

        salary: {
            type: Number,
            required: true
        },

        joiningDate: {
            type: Date,
            default: Date.now
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        },

        phone: {
            type: String
        },

        address: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Employee",
    EmployeeSchema
);
