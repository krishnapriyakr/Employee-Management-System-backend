import { Types } from 'mongoose';

export type LeaveType = 'sick' | 'casual' | 'annual' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface ILeaveRequest {
  _id: Types.ObjectId;
  employeeId: Types.ObjectId;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatus;
  approvedBy?: Types.ObjectId;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeaveBalance {
  _id: Types.ObjectId;
  employeeId: Types.ObjectId;
  year: number;
  annual: number;    // 12 days default
  sick: number;      // 10 days default
  casual: number;    // 5 days default
  unpaid: number;    // 0 days default
  used: {
    annual: number;
    sick: number;
    casual: number;
    unpaid: number;
  };
}

export interface CreateLeaveDTO {
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
}

export interface UpdateLeaveDTO {
  status?: LeaveStatus;
  comments?: string;
}

export interface LeaveFilters {
  employeeId?: string;
  status?: LeaveStatus;
  type?: LeaveType;
  startDate?: Date;
  endDate?: Date;
}