import { Schema, model } from 'mongoose';
const EmployeeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User account reference is required'],
        unique: true // One employee profile per user account
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
        required: [true, 'Base salary is required'],
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
}, { timestamps: true });
export const Employee = model('Employee', EmployeeSchema);
