import AttendanceModel, { IAttendance } from '../../models/Attendance';
import { Types } from 'mongoose';

// Create attendance record
export const createAttendance = async (data: any): Promise<IAttendance> => {
  const attendance = new AttendanceModel(data);
  return await attendance.save();
};

// Find attendance by ID
export const findAttendanceById = async (id: string): Promise<IAttendance | null> => {
  return await AttendanceModel.findById(id)
    .populate('employeeId', 'name email');
};

// Find today's attendance for employee
export const findTodayAttendance = async (employeeId: string): Promise<IAttendance | null> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return await AttendanceModel.findOne({
    employeeId: new Types.ObjectId(employeeId),
    date: { $gte: today, $lt: tomorrow }
  });
};

// Update attendance
export const updateAttendance = async (id: string, updateData: any): Promise<IAttendance | null> => {
  return await AttendanceModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

// Get employee attendance for date range
export const findEmployeeAttendance = async (
  employeeId: string,
  startDate: Date,
  endDate: Date
): Promise<IAttendance[]> => {
  return await AttendanceModel.find({
    employeeId: new Types.ObjectId(employeeId),
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });
};

// Get all attendance with filters (Admin)
export const findAllAttendance = async (
  filters: any,
  page: number = 1,
  limit: number = 20
): Promise<{ data: IAttendance[]; total: number }> => {
  const query: any = {};
  
  if (filters.employeeId) {
    query.employeeId = new Types.ObjectId(filters.employeeId);
  }
  if (filters.startDate) {
    query.date = { ...query.date, $gte: filters.startDate };
  }
  if (filters.endDate) {
    query.date = { ...query.date, $lte: filters.endDate };
  }
  if (filters.status) {
    query.status = filters.status;
  }
  
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    AttendanceModel.find(query)
      .populate('employeeId', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    AttendanceModel.countDocuments(query)
  ]);
  
  return { data, total };
};

// Get daily attendance summary for dashboard
export const getTodayAttendanceStats = async (): Promise<{
  total: number;
  present: number;
  late: number;
  absent: number;
}> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const allAttendance = await AttendanceModel.find({
    date: { $gte: today, $lt: tomorrow }
  });
  
  const total = allAttendance.length;
  const present = allAttendance.filter(a => a.status === 'present').length;
  const late = allAttendance.filter(a => a.status === 'late').length;
  const absent = 0; // Absent calculation needs separate logic
  
  return { total, present, late, absent };
};

// Get monthly attendance summary
export const getMonthlyAttendanceStats = async (
  employeeId: string,
  year: number,
  month: number
): Promise<any> => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  const attendance = await AttendanceModel.find({
    employeeId: new Types.ObjectId(employeeId),
    date: { $gte: startDate, $lte: endDate }
  });
  
  return {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'present').length,
    late: attendance.filter(a => a.status === 'late').length,
    halfDay: attendance.filter(a => a.status === 'half-day').length,
    records: attendance
  };
};