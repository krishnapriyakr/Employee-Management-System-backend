import * as attendanceRepository from './attendanceRepository';
import { IAttendance } from '../../models/Attendance';

// Helper: Calculate working hours
const calculateWorkingHours = (checkIn: Date, checkOut: Date): number => {
  const diffMs = checkOut.getTime() - checkIn.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return parseFloat(diffHours.toFixed(2));
};

// Helper: Check if late (office starts at 9:30 AM)
const isLateArrival = (checkInTime: Date): { isLate: boolean; lateMinutes: number } => {
  const officeStartTime = new Date(checkInTime);
  officeStartTime.setHours(9, 30, 0, 0);
  
  if (checkInTime > officeStartTime) {
    const lateMs = checkInTime.getTime() - officeStartTime.getTime();
    const lateMinutes = Math.floor(lateMs / (1000 * 60));
    return { isLate: true, lateMinutes };
  }
  
  return { isLate: false, lateMinutes: 0 };
};

// Helper: Determine status
const determineStatus = (isLate: boolean, checkInTime: Date, checkOutTime?: Date): 'present' | 'late' | 'half-day' => {
  if (isLate) return 'late';
  
  // If checked out before 1 PM (half day)
  if (checkOutTime && checkOutTime.getHours() < 13) {
    return 'half-day';
  }
  
  return 'present';
};

// ========== Service Functions ==========

// Check In
export const checkIn = async (employeeId: string, ipAddress?: string, location?: string) => {
  try {
    // Check if already checked in today
    const existing = await attendanceRepository.findTodayAttendance(employeeId);
    
    if (existing) {
      return {
        success: false,
        message: 'You have already checked in today'
      };
    }
    
    const now = new Date();
    const { isLate, lateMinutes } = isLateArrival(now);
    const status = determineStatus(isLate, now);
    
    const attendance = await attendanceRepository.createAttendance({
      employeeId,
      date: now,
      checkInTime: now,
      isLate,
      lateMinutes,
      status,
      ipAddress,
      location
    });
    
    return {
      success: true,
      message: `Checked in successfully${isLate ? ' (Late)' : ''}`,
      data: {
        checkInTime: attendance.checkInTime,
        isLate: attendance.isLate,
        lateMinutes: attendance.lateMinutes,
        status: attendance.status
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error checking in',
      error: error.message
    };
  }
};

// Check Out
export const checkOut = async (employeeId: string) => {
  try {
    const attendance = await attendanceRepository.findTodayAttendance(employeeId);
    
    if (!attendance) {
      return {
        success: false,
        message: 'You haven\'t checked in today'
      };
    }
    
    if (attendance.checkOutTime) {
      return {
        success: false,
        message: 'You have already checked out today'
      };
    }
    
    const now = new Date();
    const totalHours = calculateWorkingHours(attendance.checkInTime, now);
    const status = determineStatus(attendance.isLate, attendance.checkInTime, now);
    
    const attendanceId = (attendance as any)._id || (attendance as any).id;
    const updated = await attendanceRepository.updateAttendance(attendanceId.toString(), {
      checkOutTime: now,
      totalHours,
      status
    });
    
    return {
      success: true,
      message: `Checked out successfully. Total hours: ${totalHours}`,
      data: {
        checkInTime: updated?.checkInTime,
        checkOutTime: updated?.checkOutTime,
        totalHours: updated?.totalHours,
        status: updated?.status
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error checking out',
      error: error.message
    };
  }
};

// Get today's attendance status
export const getTodayStatus = async (employeeId: string) => {
  try {
    const attendance = await attendanceRepository.findTodayAttendance(employeeId);
    
    if (!attendance) {
      return {
        success: true,
        data: {
          checkedIn: false,
          checkedOut: false,
          message: 'Not checked in yet'
        }
      };
    }
    
    return {
      success: true,
      data: {
        checkedIn: true,
        checkedOut: !!attendance.checkOutTime,
        checkInTime: attendance.checkInTime,
        checkOutTime: attendance.checkOutTime,
        totalHours: attendance.totalHours,
        isLate: attendance.isLate,
        lateMinutes: attendance.lateMinutes,
        status: attendance.status
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching status',
      error: error.message
    };
  }
};

// Get my attendance for date range
export const getMyAttendance = async (employeeId: string, month?: number, year?: number) => {
  try {
    const currentYear = year || new Date().getFullYear();
    const currentMonth = month !== undefined ? month : new Date().getMonth();
    
    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);
    
    const records = await attendanceRepository.findEmployeeAttendance(
      employeeId,
      startDate,
      endDate
    );
    
    return {
      success: true,
      data: records,
      summary: {
        total: records.length,
        present: records.filter(r => r.status === 'present').length,
        late: records.filter(r => r.status === 'late').length,
        halfDay: records.filter(r => r.status === 'half-day').length
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching attendance',
      error: error.message
    };
  }
};

// Admin: Get all attendance
export const getAllAttendance = async (filters: any, page: number, limit: number) => {
  try {
    const result = await attendanceRepository.findAllAttendance(filters, page, limit);
    
    return {
      success: true,
      data: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit)
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching attendance',
      error: error.message
    };
  }
};

// Admin: Manual attendance entry
export const manualAttendanceEntry = async (data: any) => {
  try {
    const existing = await attendanceRepository.findTodayAttendance(data.employeeId);
    
    if (existing) {
      return {
        success: false,
        message: 'Attendance already exists for this employee today'
      };
    }
    
    const checkInTime = new Date(data.checkInTime);
    const { isLate, lateMinutes } = isLateArrival(checkInTime);
    const status = determineStatus(isLate, checkInTime);
    
    const attendance = await attendanceRepository.createAttendance({
      employeeId: data.employeeId,
      date: checkInTime,
      checkInTime,
      checkOutTime: data.checkOutTime ? new Date(data.checkOutTime) : undefined,
      isLate,
      lateMinutes,
      status,
      notes: data.notes
    });
    
    // Calculate total hours if checkout exists
    if (attendance.checkOutTime) {
      const totalHours = calculateWorkingHours(attendance.checkInTime, attendance.checkOutTime);
      const attendanceId = (attendance as any)._id || (attendance as any).id;
      await attendanceRepository.updateAttendance(attendanceId.toString(), { totalHours });
    }
    
    return {
      success: true,
      message: 'Attendance recorded successfully',
      data: attendance
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error recording attendance',
      error: error.message
    };
  }
};

// Admin: Update attendance record
export const updateAttendanceRecord = async (id: string, updateData: any) => {
  try {
    const attendance = await attendanceRepository.updateAttendance(id, updateData);
    
    if (!attendance) {
      return {
        success: false,
        message: 'Attendance record not found'
      };
    }
    
    return {
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error updating attendance',
      error: error.message
    };
  }
};

// Get today's dashboard stats (Admin)
export const getTodayDashboardStats = async () => {
  try {
    const stats = await attendanceRepository.getTodayAttendanceStats();
    
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