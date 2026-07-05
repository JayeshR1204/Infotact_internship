import PDFDocument from 'pdfkit';
/**
 * Streams a fully branded, production-quality PDF payslip directly to the HTTP response.
 * Uses PDFKit to generate a formatted salary receipt document.
 */
export const streamPayslipPDF = (payroll, employee, user, res) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    // ─── HTTP Response Headers ──────────────────────────────────────────────
    const filename = `Payslip_${employee.employeeId}_${payroll.payPeriod}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    doc.pipe(res);
    // ─── Color Palette ──────────────────────────────────────────────────────
    const PRIMARY = '#0d9488'; // teal-600
    const DARK = '#0f172a'; // slate-900
    const MUTED = '#64748b'; // slate-500
    const LIGHT = '#f1f5f9'; // slate-100
    const WHITE = '#ffffff';
    const pageWidth = doc.page.width - 100; // content width with margins
    // ─── HEADER BANNER ──────────────────────────────────────────────────────
    doc.rect(50, 50, pageWidth, 80).fill(PRIMARY);
    doc
        .fillColor(WHITE)
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('INFOTACT SOLUTIONS', 70, 70, { align: 'left' });
    doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#ccfbf1')
        .text('Enterprise Human Resources & Payroll Management System', 70, 98, { align: 'left' });
    // Document label on right
    doc
        .fillColor(WHITE)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('SALARY SLIP', 70, 70, { align: 'right' });
    doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#ccfbf1')
        .text(`Pay Period: ${payroll.payPeriod}`, 70, 93, { align: 'right' })
        .text(`Document ID: PAY-${employee.employeeId}-${payroll.payPeriod}`, 70, 108, { align: 'right' });
    doc.moveDown(4);
    // ─── Employee Information Section ────────────────────────────────────────
    const infoY = 155;
    doc.rect(50, infoY, pageWidth, 100).fill(LIGHT);
    doc
        .fillColor(DARK)
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('EMPLOYEE DETAILS', 70, infoY + 12);
    doc.moveTo(70, infoY + 28).lineTo(50 + pageWidth - 20, infoY + 28).strokeColor(PRIMARY).lineWidth(1).stroke();
    const col1X = 70;
    const col2X = 320;
    const rowStart = infoY + 38;
    const rowGap = 20;
    const infoRows = [
        ['Employee Name', user.name, 'Employee ID', employee.employeeId],
        ['Position', employee.position, 'Department', user.department],
        ['Status', employee.status, 'Joining Date', new Date(employee.joiningDate).toLocaleDateString('en-IN')],
        ['Email', user.email, 'Generated On', new Date().toLocaleDateString('en-IN')],
    ];
    infoRows.forEach(([label1, val1, label2, val2], i) => {
        const y = rowStart + i * rowGap;
        doc.fontSize(9).font('Helvetica-Bold').fillColor(MUTED).text(label1 + ':', col1X, y, { width: 120 });
        doc.fontSize(9).font('Helvetica').fillColor(DARK).text(val1, col1X + 120, y, { width: 140 });
        doc.fontSize(9).font('Helvetica-Bold').fillColor(MUTED).text(label2 + ':', col2X, y, { width: 120 });
        doc.fontSize(9).font('Helvetica').fillColor(DARK).text(val2, col2X + 120, y, { width: 140 });
    });
    // ─── Earnings & Deductions Table ─────────────────────────────────────────
    const tableY = infoY + 120;
    // Table header
    doc.rect(50, tableY, pageWidth, 28).fill(DARK);
    doc.fillColor(WHITE).fontSize(10).font('Helvetica-Bold')
        .text('EARNINGS', 70, tableY + 9, { width: 200 });
    doc.text('AMOUNT (₹)', 70, tableY + 9, { align: 'right' });
    const gross = payroll.baseSalary + payroll.allowances;
    const earningRows = [
        ['Basic Salary', payroll.baseSalary],
        ['House Rent Allowance', Math.round(payroll.allowances * 0.4)],
        ['Transport Allowance', Math.round(payroll.allowances * 0.2)],
        ['Medical Allowance', Math.round(payroll.allowances * 0.2)],
        ['Other Allowances', payroll.allowances - Math.round(payroll.allowances * 0.4) - Math.round(payroll.allowances * 0.2) - Math.round(payroll.allowances * 0.2)],
    ];
    let rowY = tableY + 28;
    earningRows.forEach(([label, amount], idx) => {
        const bg = idx % 2 === 0 ? WHITE : LIGHT;
        doc.rect(50, rowY, pageWidth, 22).fill(bg);
        doc.fillColor(DARK).fontSize(9).font('Helvetica').text(label, 70, rowY + 7, { width: 200 });
        doc.text(`₹ ${amount.toLocaleString('en-IN')}`, 70, rowY + 7, { align: 'right' });
        rowY += 22;
    });
    // Total earnings row
    doc.rect(50, rowY, pageWidth, 24).fill(PRIMARY);
    doc.fillColor(WHITE).fontSize(10).font('Helvetica-Bold')
        .text('Gross Earnings', 70, rowY + 7, { width: 200 });
    doc.text(`₹ ${gross.toLocaleString('en-IN')}`, 70, rowY + 7, { align: 'right' });
    rowY += 30;
    // Deductions header
    doc.rect(50, rowY, pageWidth, 28).fill('#7f1d1d');
    doc.fillColor(WHITE).fontSize(10).font('Helvetica-Bold')
        .text('DEDUCTIONS', 70, rowY + 9, { width: 200 });
    doc.text('AMOUNT (₹)', 70, rowY + 9, { align: 'right' });
    rowY += 28;
    const deductionRows = [
        ['Provident Fund (PF)', Math.round(payroll.deductions * 0.5)],
        ['Professional Tax', Math.round(payroll.deductions * 0.2)],
        ['Income Tax (TDS)', Math.round(payroll.deductions * 0.2)],
        ['Other Deductions', payroll.deductions - Math.round(payroll.deductions * 0.5) - Math.round(payroll.deductions * 0.2) - Math.round(payroll.deductions * 0.2)],
    ];
    deductionRows.forEach(([label, amount], idx) => {
        const bg = idx % 2 === 0 ? WHITE : LIGHT;
        doc.rect(50, rowY, pageWidth, 22).fill(bg);
        doc.fillColor(DARK).fontSize(9).font('Helvetica').text(label, 70, rowY + 7, { width: 200 });
        doc.fillColor('#b91c1c').text(`- ₹ ${amount.toLocaleString('en-IN')}`, 70, rowY + 7, { align: 'right' });
        rowY += 22;
    });
    // Total deductions
    doc.rect(50, rowY, pageWidth, 24).fill('#991b1b');
    doc.fillColor(WHITE).fontSize(10).font('Helvetica-Bold')
        .text('Total Deductions', 70, rowY + 7, { width: 200 });
    doc.text(`₹ ${payroll.deductions.toLocaleString('en-IN')}`, 70, rowY + 7, { align: 'right' });
    rowY += 30;
    // ─── NET PAY BANNER ──────────────────────────────────────────────────────
    doc.rect(50, rowY, pageWidth, 50).fill(PRIMARY);
    doc.fillColor(WHITE).fontSize(14).font('Helvetica-Bold')
        .text('NET PAY DISBURSED', 70, rowY + 10, { width: 200 });
    doc.fontSize(18).text(`₹ ${payroll.netPay.toLocaleString('en-IN')}`, 70, rowY + 8, { align: 'right' });
    rowY += 60;
    // ─── In Words ────────────────────────────────────────────────────────────
    doc.rect(50, rowY, pageWidth, 28).fill(LIGHT);
    doc.fillColor(MUTED).fontSize(9).font('Helvetica-Bold')
        .text('Net Pay in Words: ', 70, rowY + 9);
    doc.fontSize(9).font('Helvetica').fillColor(DARK)
        .text(numberToWords(payroll.netPay) + ' Only', 165, rowY + 9);
    rowY += 40;
    // ─── Footer ──────────────────────────────────────────────────────────────
    doc.moveTo(50, rowY).lineTo(50 + pageWidth, rowY).strokeColor('#e2e8f0').lineWidth(1).stroke();
    rowY += 10;
    doc.fillColor(MUTED).fontSize(8).font('Helvetica')
        .text('This is a system-generated payslip and does not require a physical signature. ' +
        'For discrepancies, contact HR at hr@infotact.com | Infotact Solutions Pvt. Ltd.', 50, rowY, { align: 'center', width: pageWidth });
    doc.end();
};
// ─── Simple number to words utility (for Indian amounts) ─────────────────────
function numberToWords(amount) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if (amount === 0)
        return 'Zero Rupees';
    const convert = (n) => {
        if (n < 20)
            return ones[n] ?? '';
        if (n < 100)
            return (tens[Math.floor(n / 10)] ?? '') + (n % 10 !== 0 ? ' ' + (ones[n % 10] ?? '') : '');
        if (n < 1000)
            return (ones[Math.floor(n / 100)] ?? '') + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
        if (n < 100000)
            return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
        if (n < 10000000)
            return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
        return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '');
    };
    return `Rupees ${convert(Math.floor(amount))}`;
}
export const generatePayslipPayload = (payroll, employee) => ({
    documentId: `PAY-REC-${payroll.payPeriod}-${employee.employeeId}`,
    generatedTimestamp: new Date().toISOString(),
    corporateHeader: 'INFOTACT SOLUTIONS - SALARY RECEIPT',
    meta: {
        employeeName: 'N/A',
        employeeRef: employee.employeeId,
        payPeriod: payroll.payPeriod,
        department: 'N/A'
    },
    financialBreakdown: {
        earnings: { base: payroll.baseSalary, allowances: payroll.allowances, gross: payroll.baseSalary + payroll.allowances },
        deductions: { amount: payroll.deductions },
        netDisbursed: payroll.netPay
    }
});
