import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  name: string;
  email: string;
  department: mongoose.Types.ObjectId;
  manager?: mongoose.Types.ObjectId;
}

const employeeSchema = new Schema<IEmployee>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    manager: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEmployee>(
  "Employee",
  employeeSchema
);