import { Schema, model } from 'mongoose';
// 1. Enterprise User Role Enum
export var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "Admin";
    UserRole["HR_MANAGER"] = "HR Manager";
    UserRole["EMPLOYEE"] = "Employee";
})(UserRole || (UserRole = {}));
// 3. Mongoose Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    // select: false ensures passwordHash is NEVER returned in queries by default
    passwordHash: {
        type: String,
        required: [true, 'Password hash is required'],
        select: false
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.EMPLOYEE
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        default: 'General Operations',
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
export const User = model('User', UserSchema);
