import mongoose, { Types } from 'mongoose';
import LeaveRequestModel, { ILeaveRequest } from '../../models/LeaveRequest';
import LeaveBalanceModel, { ILeaveBalance } from '../../models/LeaveBalance';

// ========== Leave Requests ==========

export const createLeaveRequest = async (data: any): Promise<ILeaveRequest> => {
  const leaveRequest = new LeaveRequestModel({
    ...data,
    employeeId: new Types.ObjectId(data.employeeId)
  });
  return await leaveRequest.save();
};

export const findLeaveRequestById = async (id: string): Promise<ILeaveRequest | null> => {
  return await LeaveRequestModel.findById(id)
    .populate('employeeId', 'name email')
    .populate('approvedBy', 'name email');
};

export const findAllLeaveRequests = async (filters: any): Promise<ILeaveRequest[]> => {
  const query: any = {};
  
  if (filters.employeeId) {
    query.employeeId = new Types.ObjectId(filters.employeeId);
  }
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.startDate) {
    query.startDate = { $gte: filters.startDate };
  }
  if (filters.endDate) {
    query.endDate = { $lte: filters.endDate };
  }

  return await LeaveRequestModel.find(query)
    .populate('employeeId', 'name email')
    .populate('approvedBy', 'name email')
    .sort({ createdAt: -1 });
};

export const findPendingRequests = async (): Promise<ILeaveRequest[]> => {
  return await LeaveRequestModel.find({ status: 'pending' })
    .populate('employeeId', 'name email department')
    .sort({ createdAt: 1 });
};

export const updateLeaveRequest = async (id: string, updateData: any): Promise<ILeaveRequest | null> => {
  // Ensure id is valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid leave request ID');
  }

  // Handle approvedBy if present
  const dataToUpdate = { ...updateData };
  if (dataToUpdate.approvedBy && typeof dataToUpdate.approvedBy === 'string') {
    dataToUpdate.approvedBy = new mongoose.Types.ObjectId(dataToUpdate.approvedBy);
  }

  return await LeaveRequestModel.findByIdAndUpdate(
    id,
    { $set: dataToUpdate },
    { new: true, runValidators: true }
  );
};

export const deleteLeaveRequest = async (id: string): Promise<ILeaveRequest | null> => {
  return await LeaveRequestModel.findByIdAndDelete(id);
};

export const findEmployeeRequests = async (employeeId: string): Promise<ILeaveRequest[]> => {
  return await LeaveRequestModel.find({ 
    employeeId: new Types.ObjectId(employeeId) 
  }).sort({ createdAt: -1 });
};

// ========== Leave Balances ==========

export const findLeaveBalance = async (employeeId: string, year: number): Promise<ILeaveBalance | null> => {
  return await LeaveBalanceModel.findOne({
    employeeId: new Types.ObjectId(employeeId),
    year
  });
};

export const createLeaveBalance = async (data: any): Promise<ILeaveBalance> => {
  const balance = new LeaveBalanceModel(data);
  return await balance.save();
};

export const updateLeaveBalance = async (employeeId: string, year: number, updateData: any): Promise<ILeaveBalance | null> => {
  return await LeaveBalanceModel.findOneAndUpdate(
    { employeeId: new Types.ObjectId(employeeId), year },
    { $set: updateData },
    { new: true, upsert: true }
  );
};

export const deductLeaveBalance = async (employeeId: string, year: number, type: string, days: number): Promise<ILeaveBalance | null> => {
  const updateField: any = {};
  updateField[type] = -days;
  
  return await LeaveBalanceModel.findOneAndUpdate(
    { employeeId: new Types.ObjectId(employeeId), year },
    { $inc: updateField },
    { new: true }
  );
};