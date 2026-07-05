import { Schema, model } from 'mongoose';
const PayrollSchema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Employee profile reference is required']
    },
    payPeriod: {
        type: String,
        required: [true, 'Pay period designation (YYYY-MM) is required'],
        trim: true
    },
    baseSalary: {
        type: Number,
        required: [true, 'Base salary replication is required'],
        min: 0
    },
    allowances: {
        type: Number,
        default: 0,
        min: 0
    },
    deductions: {
        type: Number,
        default: 0,
        min: 0
    },
    netPay: {
        type: Number,
        required: [true, 'Calculated net pay value is required'],
        min: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Processed', 'Paid'],
        default: 'Pending'
    },
    processedAt: {
        type: Date
    }
});
// Enforce a unique compound index so an employee cannot have duplicate payroll files for the same month
PayrollSchema.index({ employeeId: 1, payPeriod: 1 }, { unique: true });
export const Payroll = model('Payroll', PayrollSchema);
