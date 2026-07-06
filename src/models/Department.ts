import mongoose, { Schema } from "mongoose";

const DepartmentSchema = new Schema(
    {
        departmentName: {
            type: String,
            required: true,
            trim: true,
        },

        departmentCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        manager: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "Department",
    DepartmentSchema
);