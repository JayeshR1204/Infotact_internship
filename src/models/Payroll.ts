import mongoose, { Schema } from "mongoose";

const PayrollSchema = new Schema(
    {
        employee: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },

        basicSalary: {
            type: Number,
            required: true,
            min: 0,
        },

        allowances: {
            type: Number,
            default: 0,
            min: 0,
        },

        deductions: {
            type: Number,
            default: 0,
            min: 0,
        },

        month: {
            type: String,
            required: true,
            trim: true,
        },

        year: {
            type: Number,
            required: true,
            min: 2020,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Payroll", PayrollSchema);