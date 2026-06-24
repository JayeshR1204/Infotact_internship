import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["Admin", "HR Manager", "Employee"],
            default: "Employee"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", UserSchema);