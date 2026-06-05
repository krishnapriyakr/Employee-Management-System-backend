import ShiftModel from '../../models/Shift';
import ShiftAssignmentModel from '../../models/ShiftAssignment';
import SwapRequestModel from '../../models/SwapRequest';
import { Types } from 'mongoose';

// ========== Shift Templates ==========

export const createShift = async (data: any): Promise<any> => {
  const shift = new ShiftModel(data);
  return await shift.save();
};

export const findAllShifts = async (): Promise<any[]> => {
  return await ShiftModel.find().sort({ startTime: 1 });
};

export const findShiftById = async (id: string): Promise<any> => {
  return await ShiftModel.findById(id);
};

export const updateShift = async (id: string, data: any): Promise<any> => {
  return await ShiftModel.findByIdAndUpdate(id, { $set: data }, { new: true });
};

export const deleteShift = async (id: string): Promise<any> => {
  return await ShiftModel.findByIdAndDelete(id);
};

// ========== Shift Assignments ==========

export const assignShift = async (data: any): Promise<any> => {
  const assignment = new ShiftAssignmentModel(data);
  return await assignment.save();
};

export const findAssignmentsByEmployee = async (employeeId: string, startDate: Date, endDate: Date): Promise<any[]> => {
  return await ShiftAssignmentModel.find({
    employeeId: new Types.ObjectId(employeeId),
    date: { $gte: startDate, $lte: endDate }
  })
  .populate('shiftId')
  .sort({ date: 1 });
};

export const findAssignmentsByDate = async (date: Date): Promise<any[]> => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  
  return await ShiftAssignmentModel.find({
    date: { $gte: start, $lte: end }
  })
  .populate('employeeId', 'name email')
  .populate('shiftId');
};

export const findAssignmentById = async (id: string): Promise<any> => {
  return await ShiftAssignmentModel.findById(id)
    .populate('employeeId', 'name email')
    .populate('shiftId');
};

export const updateAssignment = async (id: string, data: any): Promise<any> => {
  return await ShiftAssignmentModel.findByIdAndUpdate(id, { $set: data }, { new: true });
};

export const deleteAssignment = async (id: string): Promise<any> => {
  return await ShiftAssignmentModel.findByIdAndDelete(id);
};

export const findAssignmentsByDateRange = async (startDate: Date, endDate: Date): Promise<any[]> => {
  return await ShiftAssignmentModel.find({
    date: { $gte: startDate, $lte: endDate }
  })
  .populate('employeeId', 'name email')
  .populate('shiftId')
  .sort({ date: 1 });
};

// ========== Swap Requests ==========

export const createSwapRequest = async (data: any): Promise<any> => {
  const swapRequest = new SwapRequestModel(data);
  return await swapRequest.save();
};

export const findSwapRequestsByEmployee = async (employeeId: string): Promise<any[]> => {
  return await SwapRequestModel.find({
    $or: [
      { fromEmployeeId: new Types.ObjectId(employeeId) },
      { toEmployeeId: new Types.ObjectId(employeeId) }
    ]
  })
  .populate('fromEmployeeId', 'name email')
  .populate('toEmployeeId', 'name email')
  .populate('assignmentId')
  .sort({ createdAt: -1 });
};

export const findPendingSwapRequests = async (employeeId: string): Promise<any[]> => {
  return await SwapRequestModel.find({
    toEmployeeId: new Types.ObjectId(employeeId),
    status: 'pending'
  })
  .populate('fromEmployeeId', 'name email')
  .populate('assignmentId')
  .sort({ createdAt: -1 });
};

export const updateSwapRequest = async (id: string, data: any): Promise<any> => {
  return await SwapRequestModel.findByIdAndUpdate(id, { $set: data }, { new: true });
};

// ========== Statistics ==========

export const getShiftStats = async (date: Date): Promise<any> => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  
  const assignments = await ShiftAssignmentModel.find({
    date: { $gte: start, $lte: end }
  });
  
  const total = assignments.length;
  const completed = assignments.filter(a => a.status === 'completed').length;
  const cancelled = assignments.filter(a => a.status === 'cancelled').length;
  
  return { total, completed, cancelled };
};

export const getEmployeeMonthlyShifts = async (employeeId: string, year: number, month: number): Promise<any> => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  const assignments = await ShiftAssignmentModel.find({
    employeeId: new Types.ObjectId(employeeId),
    date: { $gte: startDate, $lte: endDate }
  }).populate('shiftId');
  
  const totalShifts = assignments.length;
  const totalOvertime = assignments.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);
  
  return { assignments, totalShifts, totalOvertime };
};