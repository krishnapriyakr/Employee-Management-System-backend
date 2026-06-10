import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as exportService from '../services/exportService';
import EmployeeModel from '../models/EmployeeModel';
import AttendanceModel from '../models/Attendance';
import LeaveRequestModel from '../models/LeaveRequest';
import PayrollModel from '../models/Payroll';

// Export Employees to Excel
export const exportEmployeesExcel = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const employees = await EmployeeModel.find().populate('createdBy', 'name email');
    
    const buffer = await exportService.exportEmployeesToExcel(employees);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=employees_${Date.now()}.xlsx`);
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export Employees to PDF
export const exportEmployeesPDF = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const employees = await EmployeeModel.find().populate('createdBy', 'name email');
    
    const buffer = await exportService.exportEmployeesToPDF(employees);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=employees_${Date.now()}.pdf`);
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export Attendance to Excel
export const exportAttendanceExcel = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { startDate, endDate, employeeId } = req.query;
    
    const query: any = {};
    if (startDate) query.date = { $gte: new Date(startDate as string) };
    if (endDate) query.date = { ...query.date, $lte: new Date(endDate as string) };
    if (employeeId) query.employeeId = employeeId;
    
    const attendance = await AttendanceModel.find(query).populate('employeeId', 'name email');
    
    const buffer = await exportService.exportAttendanceToExcel(attendance);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=attendance_${Date.now()}.xlsx`);
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export Leave to Excel
export const exportLeaveExcel = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { status, startDate, endDate } = req.query;
    
    const query: any = {};
    if (status) query.status = status;
    if (startDate) query.startDate = { $gte: new Date(startDate as string) };
    if (endDate) query.endDate = { $lte: new Date(endDate as string) };
    
    const leaves = await LeaveRequestModel.find(query).populate('employeeId', 'name email');
    
    const buffer = await exportService.exportLeaveToExcel(leaves);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=leave_${Date.now()}.xlsx`);
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export Payroll to Excel
export const exportPayrollExcel = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { month, year } = req.query;
    
    const query: any = {};
    if (month) query.month = parseInt(month as string);
    if (year) query.year = parseInt(year as string);
    
    const payrolls = await PayrollModel.find(query).populate('employeeId', 'name email');
    
    const buffer = await exportService.exportPayrollToExcel(payrolls);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=payroll_${Date.now()}.xlsx`);
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export Payroll to PDF
export const exportPayrollPDF = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { month, year } = req.query;
    const monthNum = parseInt(month as string);
    const yearNum = parseInt(year as string);
    
    const payrolls = await PayrollModel.find({ month: monthNum, year: yearNum }).populate('employeeId', 'name email');
    
    const buffer = await exportService.exportPayrollToPDF(payrolls, monthNum, yearNum);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=payroll_${monthNum}_${yearNum}.pdf`);
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};