import mongoose, { Schema } from "mongoose";

const LeaveRequestSchema = new Schema(
    {
        employee: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },

        leaveType: {
            type: String,
            enum: ["Casual", "Sick", "Annual"],
            required: true,
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
        },

        reason: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "LeaveRequest",
    LeaveRequestSchema
);