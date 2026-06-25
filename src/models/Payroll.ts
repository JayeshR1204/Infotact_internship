import mongoose, { Schema } from "mongoose";

const PayrollSchema = new Schema(
    {
        employee: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },

        basicSalary: {
            type: Number,
            required: true
        },

        allowances: {
            type: Number,
            default: 0
        },

        deductions: {
            type: Number,
            default: 0
        },

        month: {
            type: String,
            required: true
        },

        year: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Payroll", PayrollSchema);
