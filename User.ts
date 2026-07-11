import { Schema, model, Document } from 'mongoose';

// 1. Define an Enum for Enterprise Roles to enforce strict security bounds
export enum UserRole {
    ADMIN = 'Admin',
    HR_MANAGER = 'HR Manager',
    EMPLOYEE = 'Employee'
}

// 2. Define a TypeScript Interface for your User document
export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    department: string;
    createdAt: Date;
}

// 3. Construct the Mongoose Schema matching the interface definitions
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
    passwordHash: { 
        type: String, 
        required: [true, 'Password hash target is required'] 
    },
    role: { 
        type: String, 
        enum: Object.values(UserRole), 
        default: UserRole.EMPLOYEE 
    },
    department: { 
        type: String, 
        required: [true, 'Department designation is required'],
        default: 'General Operations'
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export const User = model<IUser>('User', UserSchema);
