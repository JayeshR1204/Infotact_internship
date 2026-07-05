import { Schema, model, Document } from 'mongoose';

// 1. Enterprise User Role Enum
export enum UserRole {
    ADMIN = 'Admin',
    HR_MANAGER = 'HR Manager',
    EMPLOYEE = 'Employee'
}

// 2. TypeScript Interface
export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    department: string;
    createdAt: Date;
}

// 3. Mongoose Schema
const UserSchema = new Schema<IUser>({
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

export const User = model<IUser>('User', UserSchema);
