import { Document, Types } from 'mongoose';

export interface IAttendance extends Document {
  employeeId: Types.ObjectId;
  date: Date;
  checkInTime: Date;
  checkOutTime?: Date;
  totalHours?: number;
  status: 'present' | 'late' | 'half-day' | 'absent';
  isLate: boolean;
  lateMinutes?: number;
  ipAddress?: string;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAttendanceDTO {
  employeeId: string;
  checkInTime: Date;
  ipAddress?: string;
  location?: string;
}

export interface UpdateAttendanceDTO {
  checkOutTime?: Date;
  totalHours?: number;
  status?: 'present' | 'late' | 'half-day' | 'absent';
  notes?: string;
}

export interface AttendanceFilters {
  employeeId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
}

export interface DailyStats {
  date: string;
  present: number;
  late: number;
  absent: number;
  total: number;
}