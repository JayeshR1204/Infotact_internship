import mongoose, { Schema, Document } from "mongoose";

export interface IPayroll extends Document {
  employee: mongoose.Types.ObjectId;
  basicSalary: number;
  bonus: number;
  month: string;
}

const payrollSchema = new Schema<IPayroll>({
  employee: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },

  basicSalary: {
    type: Number,
    required: true,
  },

  bonus: {
    type: Number,
    default: 0,
  },

  month: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IPayroll>(
  "Payroll",
  payrollSchema
);
