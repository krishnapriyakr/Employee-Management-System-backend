import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as shiftService from './shiftService';

// ========== Shift Templates ==========

export const createShift = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const result = await shiftService.createShift(req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating shift',
      error: error.message
    });
  }
};

export const getAllShifts = async (req: AuthRequest, res: Response) => {
  try {
    const result = await shiftService.getAllShifts();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching shifts',
      error: error.message
    });
  }
};

export const updateShift = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const { id } = req.params;
    const result = await shiftService.updateShift(id, req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating shift',
      error: error.message
    });
  }
};

export const deleteShift = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const { id } = req.params;
    const result = await shiftService.deleteShift(id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting shift',
      error: error.message
    });
  }
};

// ========== Shift Assignments ==========

export const assignShift = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const result = await shiftService.assignShiftToEmployee(req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error assigning shift',
      error: error.message
    });
  }
};

export const getMyShifts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { month, year } = req.query;
    const result = await shiftService.getMyShifts(
      req.user.userId,
      month ? parseInt(month as string) : undefined,
      year ? parseInt(year as string) : undefined
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching shifts',
      error: error.message
    });
  }
};

export const getTodaysShifts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const result = await shiftService.getTodaysShifts();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching today\'s shifts',
      error: error.message
    });
  }
};

export const updateShiftStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { id } = req.params;
    const { status, notes } = req.body;
    const result = await shiftService.updateShiftStatus(id, status, notes);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating shift status',
      error: error.message
    });
  }
};

// ========== Swap Requests ==========

export const requestSwap = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const result = await shiftService.requestShiftSwap(req.user.userId, req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating swap request',
      error: error.message
    });
  }
};

export const getMySwapRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const result = await shiftService.getPendingSwapRequests(req.user.userId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching swap requests',
      error: error.message
    });
  }
};

export const respondToSwap = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { id } = req.params;
    const { status } = req.body;
    const result = await shiftService.respondToSwapRequest(id, req.user.userId, status);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error responding to swap request',
      error: error.message
    });
  }
};

// ========== Statistics ==========

export const getShiftStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const { date } = req.query;
    const result = await shiftService.getShiftStatistics(date as string);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

export const getMonthlySummary = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { year, month } = req.query;
    const result = await shiftService.getMonthlyShiftSummary(
      req.user.userId,
      parseInt(year as string),
      parseInt(month as string)
    );
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching monthly summary',
      error: error.message
    });
  }
};

export const getAllAssignments = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const { startDate, endDate } = req.query;
    const result = await shiftService.getAllAssignments(
      new Date(startDate as string),
      new Date(endDate as string)
    );
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching assignments',
      error: error.message
    });
  }
};