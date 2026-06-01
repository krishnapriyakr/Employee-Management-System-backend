import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as leaveService from './leaveService';

// Employee applies for leave
export const applyForLeave = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const result = await leaveService.applyForLeave(req.user.userId, req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error applying for leave',
      error: error.message
    });
  }
};

// Employee views their leaves
export const getMyLeaves = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const result = await leaveService.getMyLeaves(req.user.userId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leave requests',
      error: error.message
    });
  }
};

// Employee views leave balance
export const getMyLeaveBalance = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const result = await leaveService.getMyLeaveBalance(req.user.userId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leave balance',
      error: error.message
    });
  }
};

// Admin approves leave
export const approveLeave = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { id } = req.params;
    const { comments } = req.body;
    
    // Validate id
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({
        success: false,
        message: 'Invalid leave request ID'
      });
    }

    const result = await leaveService.approveLeave(id, req.user.userId, comments);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    console.error('Approve leave controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving leave',
      error: error.message
    });
  }
};

// Admin rejects leave
export const rejectLeave = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { id } = req.params;
    const { comments } = req.body;

    if (!comments) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const result = await leaveService.rejectLeave(id, req.user.userId, comments);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting leave',
      error: error.message
    });
  }
};

// Admin views all pending requests
export const getPendingRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const result = await leaveService.getPendingRequests();

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending requests',
      error: error.message
    });
  }
};

// Admin views all leave requests (with filters)
export const getAllLeaveRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { status, startDate, endDate } = req.query;
    const filters = {
      status: status as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined
    };

    const result = await leaveService.getAllLeaveRequests(filters);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leave requests',
      error: error.message
    });
  }
};

// Admin views leave statistics
export const getLeaveStatistics = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const result = await leaveService.getLeaveStatistics();

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};