import { Schema, model, Document } from 'mongoose';

export interface IEmployee extends Document {
    userId: Schema.Types.ObjectId; // Links the profile directly back to login credentials
    employeeId: string;           // Corporate unique identifier (e.g., EMP-2026-001)
    position: string;
    salary: number;
    joiningDate: Date;
    status: 'Active' | 'On Leave' | 'Terminated';
}

const EmployeeSchema = new Schema<IEmployee>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User account reference is required']
    },
    employeeId: {
        type: String,
        required: [true, 'Corporate Employee ID is required'],
        unique: true,
        trim: true
    },
    position: {
        type: String,
        required: [true, 'Job position title is required'],
        trim: true
    },
    salary: {
        type: Number,
        required: [true, 'Base salary specification is required'],
        min: [0, 'Salary cannot be a negative value']
    },
    joiningDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Active', 'On Leave', 'Terminated'],
        default: 'Active'
    }
});
export const Employee = model<IEmployee>('Employee', EmployeeSchema);
