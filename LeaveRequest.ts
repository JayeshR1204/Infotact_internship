import mongoose, { Schema, Document } from "mongoose";

export interface ILeaveRequest extends Document {
  employee: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: "pending" | "approved" | "rejected";
}

const leaveRequestSchema =
  new Schema<ILeaveRequest>({
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
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

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
      ],
      default: "pending",
    },
  });

export default mongoose.model<ILeaveRequest>(
  "LeaveRequest",
  leaveRequestSchema
);