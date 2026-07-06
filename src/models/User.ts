import mongoose, { Schema } from "mongoose";
import { USER_ROLES } from "../utils/constants";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: USER_ROLES,
            default: "Employee",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", UserSchema);