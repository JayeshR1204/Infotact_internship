import mongoose, { Schema } from "mongoose";

const DepartmentSchema = new Schema(
    {
        departmentName: {
            type: String,
            required: true
        },

        departmentCode: {
            type: String,
            required: true,
            unique: true
        },

        manager: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        description: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Department",
    DepartmentSchema
);