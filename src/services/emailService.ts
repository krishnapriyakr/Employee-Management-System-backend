import { sendEmail } from '../config/emailConfig';
import * as templates from './emailTemplates';
import UserModel from '../models/UserModel';

// Send email to Admin when employee applies for leave
export const sendLeaveRequestEmail = async (employeeId: string, leaveData: any) => {
  try {
    // Get employee name
    const employee = await UserModel.findById(employeeId);
    if (!employee) return { success: false, error: 'Employee not found' };
    
    // Get all admin users
    const admins = await UserModel.find({ role: 'admin' });
    if (admins.length === 0) return { success: false, error: 'No admin found' };
    
    const subject = `Leave Request - ${employee.name}`;
    const html = templates.leaveRequestTemplate(employee.name, leaveData);
    
    // Send email to all admins
    for (const admin of admins) {
      await sendEmail(admin.email, subject, html);
    }
    
    console.log(`Leave request email sent to ${admins.length} admin(s)`);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending leave request email:', error.message);
    return { success: false, error: error.message };
  }
};

// Send email to Employee when leave is approved/rejected
export const sendLeaveStatusEmail = async (employeeId: string, status: string, comments?: string) => {
  try {
    const employee = await UserModel.findById(employeeId);
    if (!employee) return { success: false, error: 'Employee not found' };
    
    const subject = `Leave Request ${status.toUpperCase()}`;
    const html = templates.leaveStatusTemplate(employee.name, status, comments);
    
    await sendEmail(employee.email, subject, html);
    console.log(` Leave status email sent to ${employee.email}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending leave status email:', error.message);
    return { success: false, error: error.message };
  }
};

// Send attendance reminder
export const sendAttendanceReminder = async (employeeId: string) => {
  try {
    const employee = await UserModel.findById(employeeId);
    if (!employee) return { success: false, error: 'Employee not found' };
    
    const subject = 'Attendance Reminder';
    const html = templates.attendanceReminderTemplate(employee.name);
    
    await sendEmail(employee.email, subject, html);
    console.log(` Attendance reminder sent to ${employee.email}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending attendance reminder:', error.message);
    return { success: false, error: error.message };
  }
};

// Send payroll processed email
export const sendPayrollProcessedEmail = async (employeeId: string, amount: number, month: number, year: number) => {
  try {
    const employee = await UserModel.findById(employeeId);
    if (!employee) return { success: false, error: 'Employee not found' };
    
    const subject = 'Payroll Processed';
    const html = templates.payrollProcessedTemplate(employee.name, amount, month, year);
    
    await sendEmail(employee.email, subject, html);
    console.log(` Payroll email sent to ${employee.email}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending payroll email:', error.message);
    return { success: false, error: error.message };
  }
};

// Send shift assignment email
export const sendShiftAssignmentEmail = async (employeeId: string, shiftData: any) => {
  try {
    const employee = await UserModel.findById(employeeId);
    if (!employee) return { success: false, error: 'Employee not found' };
    
    const subject = 'New Shift Assignment';
    const html = templates.shiftAssignmentTemplate(employee.name, shiftData);
    
    await sendEmail(employee.email, subject, html);
    console.log(` Shift assignment email sent to ${employee.email}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending shift assignment email:', error.message);
    return { success: false, error: error.message };
  }
};