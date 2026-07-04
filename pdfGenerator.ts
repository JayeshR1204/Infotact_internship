import { IPayroll } from '../models/Payroll.js';
import { IEmployee } from '../models/Employee.js';

interface ExportablePayslip {
    documentId: string;
    generatedTimestamp: string;
    corporateHeader: string;
    meta: {
        employeeRef: string;
        payPeriod: string;
    };
    financialBreakdown: {
        earnings: { base: number; allowances: number };
        deductions: { amount: number };
        netDisbursed: number;
    };
}

/**
 * Generates an immutable corporate digital receipt structure representing an audited pay period
 */
export const generatePayslipPayload = (payroll: IPayroll, employee: IEmployee): ExportablePayslip => {
    const uniqueReceiptId = `PAY-REC-${payroll.payPeriod}-${employee.employeeId}`;

    return {
        documentId: uniqueReceiptId,
        generatedTimestamp: new Date().toISOString(),
        corporateHeader: "INFOTACT SOLUTIONS ENTERPRISE NETWORKS - SALARY RECEIPT",
        meta: {
            employeeRef: employee.employeeId,
            payPeriod: payroll.payPeriod
        },
        financialBreakdown: {
            earnings: {
                base: payroll.baseSalary,
                allowances: payroll.allowances
            },
            deductions: {
                amount: payroll.deductions
            },
            netDisbursed: payroll.netPay
        }
    };
};
