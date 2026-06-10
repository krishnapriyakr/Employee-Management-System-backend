import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { Buffer } from 'buffer';

// Helper: Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper: Format date
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// ========== EXCEL EXPORTS ==========

// Export Employee List to Excel
export const exportEmployeesToExcel = async (employees: any[]): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Employees');

  worksheet.columns = [
    { header: 'S.No', key: 'sno', width: 8 },
    { header: 'Employee ID', key: 'employeeId', width: 15 },
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Department', key: 'department', width: 20 },
    { header: 'Position', key: 'position', width: 20 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Joining Date', key: 'joiningDate', width: 15 }
  ];

  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4F46E5' }
  };

  employees.forEach((emp, index) => {
    worksheet.addRow({
      sno: index + 1,
      employeeId: emp.employmentInfo?.employeeId || 'N/A',
      name: `${emp.personalInfo?.firstName || ''} ${emp.personalInfo?.lastName || ''}`,
      email: emp.personalInfo?.email || 'N/A',
      department: emp.employmentInfo?.department || 'N/A',
      position: emp.employmentInfo?.position || 'N/A',
      status: emp.employmentInfo?.status || 'N/A',
      joiningDate: formatDate(emp.employmentInfo?.joiningDate)
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as unknown as Buffer;
};

// Export Attendance Report to Excel
export const exportAttendanceToExcel = async (attendanceData: any[]): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Attendance Report');

  worksheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Employee', key: 'employee', width: 25 },
    { header: 'Check In', key: 'checkIn', width: 12 },
    { header: 'Check Out', key: 'checkOut', width: 12 },
    { header: 'Total Hours', key: 'hours', width: 12 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Late (min)', key: 'late', width: 10 }
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF10B981' }
  };

  attendanceData.forEach((record) => {
    worksheet.addRow({
      date: formatDate(record.date),
      employee: record.employeeId?.name || 'N/A',
      checkIn: record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-',
      checkOut: record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-',
      hours: record.totalHours || 0,
      status: record.status?.toUpperCase() || 'N/A',
      late: record.lateMinutes || 0
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as unknown as Buffer;
};

// Export Leave Report to Excel
export const exportLeaveToExcel = async (leaveData: any[]): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Leave Report');

  worksheet.columns = [
    { header: 'Employee', key: 'employee', width: 25 },
    { header: 'Leave Type', key: 'type', width: 15 },
    { header: 'Start Date', key: 'startDate', width: 15 },
    { header: 'End Date', key: 'endDate', width: 15 },
    { header: 'Days', key: 'days', width: 8 },
    { header: 'Reason', key: 'reason', width: 30 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Applied On', key: 'appliedOn', width: 15 }
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF59E0B' }
  };

  leaveData.forEach((leave) => {
    const days = Math.ceil((new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    worksheet.addRow({
      employee: leave.employeeId?.name || 'N/A',
      type: leave.type?.toUpperCase() || 'N/A',
      startDate: formatDate(leave.startDate),
      endDate: formatDate(leave.endDate),
      days: days,
      reason: leave.reason || '-',
      status: leave.status?.toUpperCase() || 'N/A',
      appliedOn: formatDate(leave.createdAt)
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as unknown as Buffer;
};

// Export Payroll Report to Excel
export const exportPayrollToExcel = async (payrollData: any[]): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Payroll Report');

  worksheet.columns = [
    { header: 'Employee', key: 'employee', width: 25 },
    { header: 'Month', key: 'month', width: 12 },
    { header: 'Year', key: 'year', width: 8 },
    { header: 'Basic Salary', key: 'basic', width: 15 },
    { header: 'Total Earnings', key: 'earnings', width: 15 },
    { header: 'Total Deductions', key: 'deductions', width: 15 },
    { header: 'Net Salary', key: 'net', width: 15 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Payment Date', key: 'paymentDate', width: 15 }
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF8B5CF6' }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  payrollData.forEach((payroll) => {
    const grossEarnings = payroll.grossEarnings || {};
    const deductions = payroll.deductions || {};
    
    const totalEarnings = (grossEarnings.basicSalary || 0) + (grossEarnings.hra || 0) + 
                          (grossEarnings.da || 0) + (grossEarnings.ca || 0) + 
                          (grossEarnings.specialAllowance || 0) + (grossEarnings.bonus || 0) +
                          (grossEarnings.overtimeAmount || 0) + (grossEarnings.attendanceBonus || 0);
    
    const totalDeductions = (deductions.pf || 0) + (deductions.professionalTax || 0) + 
                            (deductions.tds || 0) + (deductions.leaveDeductions || 0) +
                            (deductions.otherDeductions || 0);
    
    worksheet.addRow({
      employee: payroll.employeeId?.name || 'N/A',
      month: months[payroll.month - 1],
      year: payroll.year,
      basic: formatCurrency(grossEarnings.basicSalary || 0),
      earnings: formatCurrency(totalEarnings),
      deductions: formatCurrency(totalDeductions),
      net: formatCurrency(payroll.netSalary || 0),
      status: payroll.status?.toUpperCase() || 'DRAFT',
      paymentDate: payroll.paymentDate ? formatDate(payroll.paymentDate) : '-'
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as unknown as Buffer;
};

// ========== PDF EXPORTS ==========

// Export Employee Report to PDF
export const exportEmployeesToPDF = async (employees: any[]): Promise<Buffer> => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks: Buffer[] = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('Employee Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).font('Helvetica').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(2);

    // Table Header
    const startX = 50;
    let startY = doc.y;
    const colWidths = [30, 60, 80, 50, 50];

    doc.font('Helvetica-Bold').fontSize(9);
    doc.text('S.No', startX, startY);
    doc.text('Emp ID', startX + colWidths[0], startY);
    doc.text('Name', startX + colWidths[0] + colWidths[1], startY);
    doc.text('Department', startX + colWidths[0] + colWidths[1] + colWidths[2], startY);
    doc.text('Status', startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], startY);

    doc.moveTo(startX, startY + 5).lineTo(startX + 350, startY + 5).stroke();

    // Table Body
    doc.font('Helvetica').fontSize(8);
    let y = startY + 15;

    employees.forEach((emp, index) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc.text(String(index + 1), startX, y);
      doc.text(emp.employmentInfo?.employeeId || 'N/A', startX + colWidths[0], y);
      doc.text(`${emp.personalInfo?.firstName || ''} ${emp.personalInfo?.lastName || ''}`, startX + colWidths[0] + colWidths[1], y);
      doc.text(emp.employmentInfo?.department || 'N/A', startX + colWidths[0] + colWidths[1] + colWidths[2], y);
      doc.text(emp.employmentInfo?.status || 'N/A', startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y);

      y += 20;
    });

    doc.fontSize(8).font('Helvetica');
    doc.text(`Total Employees: ${employees.length}`, 50, doc.page.height - 50);

    doc.end();
  });
};

// Export Payroll Report to PDF
export const exportPayrollToPDF = async (payrollData: any[], month: number, year: number): Promise<Buffer> => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks: Buffer[] = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('Payroll Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).font('Helvetica').text(`${months[month - 1]} ${year}`, { align: 'center' });
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(2);

    // Summary
    const totalPayroll = payrollData.reduce((sum, p) => sum + (p.netSalary || 0), 0);
    
    doc.font('Helvetica-Bold').fontSize(11);
    doc.text('Summary', 50, doc.y);
    doc.font('Helvetica').fontSize(10);
    doc.text(`Total Employees: ${payrollData.length}`, 50, doc.y);
    doc.text(`Total Payroll Amount: ${formatCurrency(totalPayroll)}`, 50, doc.y);
    doc.moveDown();

    // Table Header
    let startY = doc.y;
    doc.font('Helvetica-Bold').fontSize(9);
    doc.text('Employee', 50, startY);
    doc.text('Basic Salary', 180, startY);
    doc.text('Total Earnings', 280, startY);
    doc.text('Deductions', 380, startY);
    doc.text('Net Salary', 480, startY);

    doc.moveTo(50, startY + 5).lineTo(550, startY + 5).stroke();

    // Table Body
    doc.font('Helvetica').fontSize(8);
    let y = startY + 15;

    payrollData.forEach((payroll) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text('Employee', 50, y);
        doc.text('Basic Salary', 180, y);
        doc.text('Total Earnings', 280, y);
        doc.text('Deductions', 380, y);
        doc.text('Net Salary', 480, y);
        doc.moveTo(50, y + 5).lineTo(550, y + 5).stroke();
        doc.font('Helvetica').fontSize(8);
        y += 15;
      }

      const grossEarnings = payroll.grossEarnings || {};
      const deductions = payroll.deductions || {};
      
      const totalEarnings = (grossEarnings.basicSalary || 0) + (grossEarnings.hra || 0) + 
                            (grossEarnings.da || 0) + (grossEarnings.ca || 0) + 
                            (grossEarnings.specialAllowance || 0) + (grossEarnings.bonus || 0) +
                            (grossEarnings.overtimeAmount || 0) + (grossEarnings.attendanceBonus || 0);
      
      const totalDeductions = (deductions.pf || 0) + (deductions.professionalTax || 0) + 
                              (deductions.tds || 0) + (deductions.leaveDeductions || 0) +
                              (deductions.otherDeductions || 0);

      doc.text(payroll.employeeId?.name || 'N/A', 50, y);
      doc.text(formatCurrency(grossEarnings.basicSalary || 0), 180, y);
      doc.text(formatCurrency(totalEarnings), 280, y);
      doc.text(formatCurrency(totalDeductions), 380, y);
      doc.text(formatCurrency(payroll.netSalary || 0), 480, y);

      y += 20;
    });

    doc.end();
  });
};