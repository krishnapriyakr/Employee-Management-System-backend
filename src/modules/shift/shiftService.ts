import * as shiftRepository from './shiftRepository';
import { Types } from 'mongoose';
import { sendShiftAssignmentEmail } from '../../services/emailService';

// ========== Shift Templates ==========

export const createShift = async (data: any) => {
  try {
    const shift = await shiftRepository.createShift(data);
    return {
      success: true,
      message: 'Shift created successfully',
      data: shift
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error creating shift',
      error: error.message
    };
  }
};

export const getAllShifts = async () => {
  try {
    const shifts = await shiftRepository.findAllShifts();
    return {
      success: true,
      data: shifts
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching shifts',
      error: error.message
    };
  }
};

export const updateShift = async (id: string, data: any) => {
  try {
    const shift = await shiftRepository.updateShift(id, data);
    if (!shift) {
      return {
        success: false,
        message: 'Shift not found'
      };
    }
    return {
      success: true,
      message: 'Shift updated successfully',
      data: shift
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error updating shift',
      error: error.message
    };
  }
};

export const deleteShift = async (id: string) => {
  try {
    const shift = await shiftRepository.deleteShift(id);
    if (!shift) {
      return {
        success: false,
        message: 'Shift not found'
      };
    }
    return {
      success: true,
      message: 'Shift deleted successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error deleting shift',
      error: error.message
    };
  }
};

// ========== Shift Assignments ==========

export const assignShiftToEmployee = async (data: any) => {
  try {
    // Get shift details for email
    const shiftTemplate = await shiftRepository.findShiftById(data.shiftId);
    
    // Check if already assigned for this date
    const existing = await shiftRepository.findAssignmentsByEmployee(
      data.employeeId,
      new Date(data.date),
      new Date(data.date)
    );
    
    if (existing.length > 0) {
      return {
        success: false,
        message: 'Employee already has a shift on this date'
      };
    }
    
    const assignment = await shiftRepository.assignShift({
      employeeId: new Types.ObjectId(data.employeeId),
      shiftId: new Types.ObjectId(data.shiftId),
      date: new Date(data.date),
      overtimeHours: data.overtimeHours || 0,
      notes: data.notes
    });
    
    //  Send email notification to employee
    if (shiftTemplate) {
      await sendShiftAssignmentEmail(data.employeeId, {
        title: shiftTemplate.title,
        date: data.date,
        startTime: shiftTemplate.startTime,
        endTime: shiftTemplate.endTime
      });
    }
    
    return {
      success: true,
      message: 'Shift assigned successfully',
      data: assignment
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error assigning shift',
      error: error.message
    };
  }
};

export const getMyShifts = async (employeeId: string, month?: number, year?: number) => {
  try {
    const currentYear = year || new Date().getFullYear();
    const currentMonth = month !== undefined ? month : new Date().getMonth();
    
    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);
    
    const assignments = await shiftRepository.findAssignmentsByEmployee(employeeId, startDate, endDate);
    
    return {
      success: true,
      data: assignments
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching shifts',
      error: error.message
    };
  }
};

export const getTodaysShifts = async () => {
  try {
    const today = new Date();
    const assignments = await shiftRepository.findAssignmentsByDate(today);
    
    return {
      success: true,
      data: assignments
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching today\'s shifts',
      error: error.message
    };
  }
};

export const updateShiftStatus = async (assignmentId: string, status: string, notes?: string) => {
  try {
    const assignment = await shiftRepository.updateAssignment(assignmentId, { status, notes });
    
    if (!assignment) {
      return {
        success: false,
        message: 'Shift assignment not found'
      };
    }
    
    return {
      success: true,
      message: 'Shift status updated',
      data: assignment
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error updating shift status',
      error: error.message
    };
  }
};

// ========== Swap Requests ==========

export const requestShiftSwap = async (fromEmployeeId: string, data: any) => {
  try {
    const assignment = await shiftRepository.findAssignmentById(data.assignmentId);
    
    if (!assignment) {
      return {
        success: false,
        message: 'Shift assignment not found'
      };
    }
    
    if (assignment.employeeId.toString() !== fromEmployeeId) {
      return {
        success: false,
        message: 'You can only swap your own shifts'
      };
    }
    
    const swapRequest = await shiftRepository.createSwapRequest({
      assignmentId: new Types.ObjectId(data.assignmentId),
      fromEmployeeId: new Types.ObjectId(fromEmployeeId),
      toEmployeeId: new Types.ObjectId(data.toEmployeeId),
      message: data.message
    });
    
    await shiftRepository.updateAssignment(data.assignmentId, {
      status: 'swap_requested',
      swapRequestId: swapRequest._id,
      swapWithEmployeeId: new Types.ObjectId(data.toEmployeeId),
      swapStatus: 'pending'
    });
    
    return {
      success: true,
      message: 'Swap request sent',
      data: swapRequest
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error creating swap request',
      error: error.message
    };
  }
};

export const getPendingSwapRequests = async (employeeId: string) => {
  try {
    const requests = await shiftRepository.findPendingSwapRequests(employeeId);
    return {
      success: true,
      data: requests
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching swap requests',
      error: error.message
    };
  }
};

export const respondToSwapRequest = async (requestId: string, employeeId: string, status: string) => {
  try {
    const swapRequest = await shiftRepository.updateSwapRequest(requestId, {
      status,
      respondedAt: new Date()
    });
    
    if (!swapRequest) {
      return {
        success: false,
        message: 'Swap request not found'
      };
    }
    
    if (swapRequest.toEmployeeId.toString() !== employeeId) {
      return {
        success: false,
        message: 'You are not authorized to respond to this request'
      };
    }
    
    if (status === 'approved') {
      // Swap the shifts
      const assignment = await shiftRepository.findAssignmentById(swapRequest.assignmentId.toString());
      if (assignment) {
        await shiftRepository.updateAssignment(assignment._id.toString(), {
          employeeId: swapRequest.toEmployeeId,
          status: 'scheduled',
          swapStatus: null,
          swapRequestId: null
        });
      }
    } else {
      await shiftRepository.updateAssignment(swapRequest.assignmentId.toString(), {
        status: 'scheduled',
        swapStatus: null,
        swapRequestId: null
      });
    }
    
    return {
      success: true,
      message: `Swap request ${status}`,
      data: swapRequest
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error responding to swap request',
      error: error.message
    };
  }
};

// ========== Statistics ==========

export const getShiftStatistics = async (date?: string) => {
  try {
    const targetDate = date ? new Date(date) : new Date();
    const stats = await shiftRepository.getShiftStats(targetDate);
    
    return {
      success: true,
      data: stats
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    };
  }
};

export const getMonthlyShiftSummary = async (employeeId: string, year: number, month: number) => {
  try {
    const result = await shiftRepository.getEmployeeMonthlyShifts(employeeId, year, month);
    
    return {
      success: true,
      data: result
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching monthly summary',
      error: error.message
    };
  }
};

export const getAllAssignments = async (startDate: Date, endDate: Date) => {
  try {
    const assignments = await shiftRepository.findAssignmentsByDateRange(startDate, endDate);
    
    return {
      success: true,
      data: assignments
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching assignments',
      error: error.message
    };
  }
};