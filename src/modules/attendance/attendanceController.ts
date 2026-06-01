import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as attendanceService from './attendanceService';

// Employee: Check In
export const checkIn = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { ipAddress, location } = req.body;
    const result = await attendanceService.checkIn(
      req.user.userId,
      ipAddress || req.ip,
      location
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error checking in',
      error: error.message
    });
  }
};

// Employee: Check Out
export const checkOut = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const result = await attendanceService.checkOut(req.user.userId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error checking out',
      error: error.message
    });
  }
};

// Employee: Get today's status
export const getTodayStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const result = await attendanceService.getTodayStatus(req.user.userId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching status',
      error: error.message
    });
  }
};

// Employee: Get my attendance
export const getMyAttendance = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { month, year } = req.query;
    const result = await attendanceService.getMyAttendance(
      req.user.userId,
      month ? parseInt(month as string) : undefined,
      year ? parseInt(year as string) : undefined
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance',
      error: error.message
    });
  }
};

// Admin: Get all attendance
export const getAllAttendance = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const { employeeId, startDate, endDate, status } = req.query;

    const filters = {
      employeeId: employeeId as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      status: status as string
    };

    const result = await attendanceService.getAllAttendance(filters, page, limit);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance',
      error: error.message
    });
  }
};

// Admin: Manual entry
export const manualEntry = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const result = await attendanceService.manualAttendanceEntry(req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error recording attendance',
      error: error.message
    });
  }
};

// Admin: Update attendance
export const updateAttendance = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { id } = req.params;
    const result = await attendanceService.updateAttendanceRecord(id, req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating attendance',
      error: error.message
    });
  }
};

// Admin: Dashboard stats
export const getAttendanceStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const result = await attendanceService.getTodayDashboardStats();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
};