import * as payrollRepository from './payrollRepository';
import AttendanceModel from '../../models/Attendance';
import LeaveRequestModel from '../../models/LeaveRequest';
import ShiftAssignmentModel from '../../models/ShiftAssignment';
import { Types } from 'mongoose';
import { sendPayrollProcessedEmail } from '../../services/emailService';

// Helper: Calculate working days in a month
const getWorkingDaysInMonth = (year: number, month: number): number => {
  const date = new Date(year, month + 1, 0);
  let workingDays = 0;
  for (let i = 1; i <= date.getDate(); i++) {
    const day = new Date(year, month, i).getDay();
    if (day !== 0 && day !== 6) workingDays++;
  }
  return workingDays;
};

// Helper: Calculate per day salary
const getPerDaySalary = (monthlySalary: number, workingDays: number): number => {
  return monthlySalary / workingDays;
};

// ========== Salary Structure ==========

export const createSalaryStructure = async (adminId: string, data: any) => {
  try {
    // Deactivate old structure
    const oldStructure = await payrollRepository.findSalaryStructureByEmployee(data.employeeId);
    if (oldStructure) {
      await payrollRepository.deactivateSalaryStructure(oldStructure._id);
    }
    
    const salary = await payrollRepository.createSalaryStructure(data);
    return {
      success: true,
      message: 'Salary structure created successfully',
      data: salary
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error creating salary structure',
      error: error.message
    };
  }
};

export const getEmployeeSalaryStructure = async (employeeId: string) => {
  try {
    const salary = await payrollRepository.findSalaryStructureByEmployee(employeeId);
    return {
      success: true,
      data: salary
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching salary structure',
      error: error.message
    };
  }
};

export const getAllSalaryStructures = async () => {
  try {
    const salaries = await payrollRepository.findAllSalaryStructures();
    return {
      success: true,
      data: salaries
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching salary structures',
      error: error.message
    };
  }
};

// ========== Payroll Processing ==========

export const processPayroll = async (adminId: string, employeeId: string, month: number, year: number) => {
  try {
    // Check if already processed
    const existing = await payrollRepository.findPayrollByEmployee(employeeId, month, year);
    if (existing && existing.status !== 'draft') {
      return {
        success: false,
        message: 'Payroll already processed for this period'
      };
    }
    
    // Get salary structure
    const salaryStructure = await payrollRepository.findSalaryStructureByEmployee(employeeId);
    if (!salaryStructure) {
      return {
        success: false,
        message: 'No salary structure found for employee'
      };
    }
    
    // Calculate attendance
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    const attendance = await AttendanceModel.find({
      employeeId: new Types.ObjectId(employeeId),
      date: { $gte: startDate, $lte: endDate }
    });
    
    const presentDays = attendance.filter(a => a.status === 'present').length;
    const lateDays = attendance.filter(a => a.status === 'late').length;
    const absentDays = attendance.filter(a => a.status === 'absent').length;
    
    // Calculate leave days
    const leaves = await LeaveRequestModel.find({
      employeeId: new Types.ObjectId(employeeId),
      status: 'approved',
      startDate: { $gte: startDate },
      endDate: { $lte: endDate }
    });
    
    let leaveDays = 0;
    leaves.forEach(leave => {
      const days = Math.ceil((leave.endDate.getTime() - leave.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      leaveDays += days;
    });
    
    // Calculate overtime hours
    const shifts = await ShiftAssignmentModel.find({
      employeeId: new Types.ObjectId(employeeId),
      date: { $gte: startDate, $lte: endDate },
      status: 'completed'
    });
    
    const overtimeHours = shifts.reduce((sum, s) => sum + (s.overtimeHours || 0), 0);
    
    // Calculate working days
    const workingDays = getWorkingDaysInMonth(year, month);
    const perDaySalary = getPerDaySalary(salaryStructure.basicSalary, workingDays);
    
    // Calculate earnings
    const basicSalary = salaryStructure.basicSalary;
    const attendanceBonus = presentDays * 100; // ₹100 per present day
    const overtimeAmount = overtimeHours * 200; // ₹200 per overtime hour
    const leaveDeductions = leaveDays * perDaySalary;
    
    const grossEarnings = {
      basicSalary,
      hra: salaryStructure.hra,
      da: salaryStructure.da,
      ca: salaryStructure.ca,
      specialAllowance: salaryStructure.specialAllowance,
      bonus: salaryStructure.bonus,
      overtimeAmount,
      attendanceBonus,
      otherEarnings: 0
    };
    
    const totalGross = Object.values(grossEarnings).reduce((a, b) => a + b, 0);
    
    // Calculate deductions
    const deductions = {
      pf: salaryStructure.pf,
      professionalTax: salaryStructure.professionalTax,
      tds: salaryStructure.tds,
      leaveDeductions,
      advanceDeduction: 0,
      otherDeductions: salaryStructure.otherDeductions
    };
    
    const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
    const netSalary = totalGross - totalDeductions;
    
    // Create payroll record
    const payrollData = {
      employeeId: new Types.ObjectId(employeeId),
      month,
      year,
      grossEarnings,
      deductions,
      netSalary,
      attendanceDays: workingDays,
      presentDays,
      absentDays,
      leaveDays,
      overtimeHours,
      status: 'processed',
      processedBy: new Types.ObjectId(adminId),
      processedAt: new Date()
    };
    
    let payroll;
    if (existing) {
      payroll = await payrollRepository.updatePayroll(existing._id, payrollData);
    } else {
      payroll = await payrollRepository.createPayroll(payrollData);
    }
    
    // Send email notification to employee
    await sendPayrollProcessedEmail(employeeId, netSalary, month, year);
    
    return {
      success: true,
      message: 'Payroll processed successfully',
      data: payroll
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error processing payroll',
      error: error.message
    };
  }
};

export const processAllPayroll = async (adminId: string, month: number, year: number) => {
  try {
    const salaryStructures = await payrollRepository.findAllSalaryStructures();
    const results = [];
    
    for (const structure of salaryStructures) {
      const result = await processPayroll(adminId, structure.employeeId._id, month, year);
      results.push(result);
    }
    
    return {
      success: true,
      message: `Processed payroll for ${results.length} employees`,
      data: results
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error processing payroll',
      error: error.message
    };
  }
};

export const getMyPayroll = async (employeeId: string, month?: number, year?: number) => {
  try {
    const query: any = { employeeId: new Types.ObjectId(employeeId) };
    if (month !== undefined) query.month = month;
    if (year !== undefined) query.year = year;
    
    let payrolls = await payrollRepository.findAllPayrolls(query);
    
    return {
      success: true,
      data: payrolls
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching payroll',
      error: error.message
    };
  }
};

export const getAllPayrolls = async (filters: any) => {
  try {
    const payrolls = await payrollRepository.findAllPayrolls(filters);
    return {
      success: true,
      data: payrolls
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching payrolls',
      error: error.message
    };
  }
};

export const updatePayrollStatus = async (payrollId: string, status: string, paymentMode?: string, transactionId?: string) => {
  try {
    const payroll = await payrollRepository.updatePayroll(payrollId, {
      status,
      paymentDate: status === 'paid' ? new Date() : undefined,
      paymentMode,
      transactionId
    });
    
    return {
      success: true,
      message: `Payroll ${status} successfully`,
      data: payroll
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error updating payroll status',
      error: error.message
    };
  }
};

export const getPayrollStats = async () => {
  try {
    const stats = await payrollRepository.getPayrollStats();
    return {
      success: true,
      data: stats
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching stats',
      error: error.message
    };
  }
};

// ========== Bank Details ==========

export const saveBankDetails = async (employeeId: string, data: any) => {
  try {
    if (data.accountNumber !== data.confirmAccountNumber) {
      return {
        success: false,
        message: 'Account numbers do not match'
      };
    }
    
    const bankDetails = await payrollRepository.updateBankDetails(employeeId, {
      ...data,
      employeeId: new Types.ObjectId(employeeId)
    });
    
    return {
      success: true,
      message: 'Bank details saved successfully',
      data: bankDetails
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error saving bank details',
      error: error.message
    };
  }
};

export const getBankDetails = async (employeeId: string) => {
  try {
    const bankDetails = await payrollRepository.findBankDetailsByEmployee(employeeId);
    return {
      success: true,
      data: bankDetails
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching bank details',
      error: error.message
    };
  }
};