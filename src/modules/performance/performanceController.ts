import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as performanceService from './performanceService';

// ========== Performance Reviews ==========

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }
    
    const result = await performanceService.createReview(req.user.userId, req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

export const submitSelfAssessment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    const { id } = req.params;
    const result = await performanceService.submitSelfAssessment(id, req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error submitting self assessment',
      error: error.message
    });
  }
};

export const submitManagerAssessment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }
    
    const { id } = req.params;
    const result = await performanceService.submitManagerAssessment(id, req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error submitting manager assessment',
      error: error.message
    });
  }
};

export const getMyReviews = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    const result = await performanceService.getMyReviews(req.user.userId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

export const getPendingReviews = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }
    
    const result = await performanceService.getPendingReviews();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending reviews',
      error: error.message
    });
  }
};

export const getAllReviews = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }
    
    const { employeeId, status, year, reviewCycle } = req.query;
    const filters = {
      employeeId: employeeId as string,
      status: status as string,
      year: year ? parseInt(year as string) : undefined,
      reviewCycle: reviewCycle as string
    };
    
    const result = await performanceService.getAllReviews(filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// ========== Goals ==========

export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }
    
    const result = await performanceService.createGoal(req.user.userId, req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating goal',
      error: error.message
    });
  }
};

export const getMyGoals = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    const result = await performanceService.getMyGoals(req.user.userId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching goals',
      error: error.message
    });
  }
};

export const updateGoalProgress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    const { id } = req.params;
    const { progress } = req.body;
    const result = await performanceService.updateGoalProgress(id, progress);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating goal',
      error: error.message
    });
  }
};

export const getAllGoals = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }
    
    const { employeeId, status, category } = req.query;
    const filters = {
      employeeId: employeeId as string,
      status: status as string,
      category: category as string
    };
    
    const result = await performanceService.getAllGoals(filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching goals',
      error: error.message
    });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }
    
    const { id } = req.params;
    const result = await performanceService.deleteGoal(id);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting goal',
      error: error.message
    });
  }
};

export const getPerformanceStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }
    
    const result = await performanceService.getPerformanceStats();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
};