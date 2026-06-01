import mongoose from 'mongoose';
import * as leaveRepository from './leaveRepository';

// Helper: Calculate working days (excluding weekends)
const calculateWorkingDays = (startDate: Date, endDate: Date): number => {
  let days = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      days++;
    }
    current.setDate(current.getDate() + 1);
  }
  return days;
};

// Helper: Check if employee has sufficient balance
const checkLeaveBalance = async (employeeId: string, type: string, days: number, year: number): Promise<boolean> => {
  const balance = await leaveRepository.findLeaveBalance(employeeId, year);
  if (!balance) return false;
  
  switch (type) {
    case 'annual': return (balance.annual || 0) >= days;
    case 'sick': return (balance.sick || 0) >= days;
    case 'casual': return (balance.casual || 0) >= days;
    default: return true;
  }
};

// Helper: Check for overlapping leaves
const hasOverlappingLeave = async (employeeId: string, startDate: Date, endDate: Date): Promise<boolean> => {
  const existingLeaves = await leaveRepository.findEmployeeRequests(employeeId);
  
  return existingLeaves.some((leave: any) => {
    if (leave.status === 'rejected') return false;
    
    const existingStart = new Date(leave.startDate);
    const existingEnd = new Date(leave.endDate);
    
    return (startDate <= existingEnd && endDate >= existingStart);
  });
};

// ========== Service Functions ==========

export const applyForLeave = async (employeeId: string, leaveData: any) => {
  try {
    const { type, startDate, endDate, reason } = leaveData;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const year = start.getFullYear();
    
    // Calculate days
    const days = calculateWorkingDays(start, end);
    
    // Validate dates
    if (start > end) {
      return {
        success: false,
        message: 'Start date cannot be after end date'
      };
    }
    
    if (days <= 0) {
      return {
        success: false,
        message: 'Invalid date range'
      };
    }
    
    // Check for overlapping leaves
    const hasOverlap = await hasOverlappingLeave(employeeId, start, end);
    if (hasOverlap) {
      return {
        success: false,
        message: 'You already have a leave request for these dates'
      };
    }
    
    // Check balance (skip for unpaid leave)
    if (type !== 'unpaid') {
      const hasBalance = await checkLeaveBalance(employeeId, type, days, year);
      if (!hasBalance) {
        return {
          success: false,
          message: `Insufficient ${type} leave balance`
        };
      }
    }
    
    // Create leave request
    const leaveRequest = await leaveRepository.createLeaveRequest({
      employeeId,
      type,
      startDate: start,
      endDate: end,
      reason,
      status: 'pending'
    });
    
    return {
      success: true,
      message: 'Leave request submitted successfully',
      data: leaveRequest
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error applying for leave',
      error: error.message
    };
  }
};

export const approveLeave = async (leaveId: string, adminId: string, comments?: string) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(leaveId)) {
      return {
        success: false,
        message: 'Invalid leave request ID'
      };
    }

    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return {
        success: false,
        message: 'Invalid admin ID'
      };
    }

    const leaveRequest = await leaveRepository.findLeaveRequestById(leaveId);
    
    if (!leaveRequest) {
      return {
        success: false,
        message: 'Leave request not found'
      };
    }
    
    if (leaveRequest.status !== 'pending') {
      return {
        success: false,
        message: 'Leave request already processed'
      };
    }
    
    const days = calculateWorkingDays(leaveRequest.startDate, leaveRequest.endDate);
    const year = leaveRequest.startDate.getFullYear();
    
    // Deduct balance (skip for unpaid)
    if (leaveRequest.type !== 'unpaid') {
      await leaveRepository.deductLeaveBalance(
        leaveRequest.employeeId.toString(),
        year,
        leaveRequest.type,
        days
      );
    }
    
    const updatedRequest = await leaveRepository.updateLeaveRequest(leaveId, {
      status: 'approved',
      approvedBy: new mongoose.Types.ObjectId(adminId), // Convert to ObjectId
      comments: comments || '',
      updatedAt: new Date()
    });
    
    return {
      success: true,
      message: 'Leave request approved',
      data: updatedRequest
    };
  } catch (error: any) {
    console.error('Approve leave error:', error);
    return {
      success: false,
      message: 'Error approving leave',
      error: error.message
    };
  }
};

export const rejectLeave = async (leaveId: string, adminId: string, comments: string) => {
  try {
    const leaveRequest = await leaveRepository.findLeaveRequestById(leaveId);
    
    if (!leaveRequest) {
      return {
        success: false,
        message: 'Leave request not found'
      };
    }
    
    if (leaveRequest.status !== 'pending') {
      return {
        success: false,
        message: 'Leave request already processed'
      };
    }
    
    const updatedRequest = await leaveRepository.updateLeaveRequest(leaveId, {
      status: 'rejected',
      approvedBy: adminId,
      comments,
      updatedAt: new Date()
    });
    
    return {
      success: true,
      message: 'Leave request rejected',
      data: updatedRequest
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error rejecting leave',
      error: error.message
    };
  }
};

export const getMyLeaves = async (employeeId: string) => {
  try {
    const leaves = await leaveRepository.findEmployeeRequests(employeeId);
    
    return {
      success: true,
      message: 'Leave requests fetched successfully',
      data: leaves
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching leave requests',
      error: error.message
    };
  }
};

export const getMyLeaveBalance = async (employeeId: string) => {
  try {
    const year = new Date().getFullYear();
    let balance = await leaveRepository.findLeaveBalance(employeeId, year);
    
    if (!balance) {
      balance = await leaveRepository.createLeaveBalance({
        employeeId,
        annual: 12,
        sick: 10,
        casual: 5,
        year
      });
    }
    
    return {
      success: true,
      message: 'Leave balance fetched successfully',
      data: balance
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching leave balance',
      error: error.message
    };
  }
};

export const getPendingRequests = async () => {
  try {
    const pendingRequests = await leaveRepository.findPendingRequests();
    
    return {
      success: true,
      message: 'Pending requests fetched successfully',
      data: pendingRequests
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching pending requests',
      error: error.message
    };
  }
};

export const getAllLeaveRequests = async (filters: any) => {
  try {
    const requests = await leaveRepository.findAllLeaveRequests(filters);
    
    return {
      success: true,
      message: 'Leave requests fetched successfully',
      data: requests
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching leave requests',
      error: error.message
    };
  }
};

export const getLeaveStatistics = async () => {
  try {
    const allRequests = await leaveRepository.findAllLeaveRequests({});
    
    const stats = {
      total: allRequests.length,
      pending: allRequests.filter((r: any) => r.status === 'pending').length,
      approved: allRequests.filter((r: any) => r.status === 'approved').length,
      rejected: allRequests.filter((r: any) => r.status === 'rejected').length,
      byType: {
        sick: allRequests.filter((r: any) => r.type === 'sick').length,
        casual: allRequests.filter((r: any) => r.type === 'casual').length,
        annual: allRequests.filter((r: any) => r.type === 'annual').length,
        unpaid: allRequests.filter((r: any) => r.type === 'unpaid').length
      }
    };
    
    return {
      success: true,
      message: 'Leave statistics fetched successfully',
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