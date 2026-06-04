import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as recruitmentService from './recruitmentService';
import path from 'path';

// ========== Jobs ==========

export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const result = await recruitmentService.createJob(req.user.userId, req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    });
  }
};

export const getAllJobs = async (req: AuthRequest, res: Response) => {
  try {
    const { department, employmentType, search } = req.query;
    const isPublic = req.path.includes('/public');
    
    const result = await recruitmentService.getAllJobs(
      { department, employmentType, search },
      isPublic
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

export const getJobById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const incrementView = !req.user || req.user?.role !== 'admin';
    
    const result = await recruitmentService.getJobById(id, incrementView);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
};

export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const { id } = req.params;
    const result = await recruitmentService.updateJob(id, req.body);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message
    });
  }
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const { id } = req.params;
    const result = await recruitmentService.deleteJob(id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message
    });
  }
};

// ========== Applications ==========

export const applyForJob = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required'
      });
    }

    const result = await recruitmentService.applyForJob(jobId, req.body, file);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message
    });
  }
};

export const getAllApplications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const { jobId, status, search } = req.query;
    const result = await recruitmentService.getAllApplications({ jobId, status, search });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const { id } = req.params;
    const result = await recruitmentService.getApplicationById(id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const { id } = req.params;
    const { status, comments } = req.body;
    const result = await recruitmentService.updateApplicationStatus(id, req.user.userId, status, comments);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating application status',
      error: error.message
    });
  }
};

export const scheduleInterview = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const { id } = req.params;
    const result = await recruitmentService.scheduleInterview(id, req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error scheduling interview',
      error: error.message
    });
  }
};

export const getApplicationStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const result = await recruitmentService.getApplicationStats();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
};

export const downloadResume = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const { id } = req.params;
    const result = await recruitmentService.downloadResume(id);

    if (!result.success || !result.filePath) {
      return res.status(404).json({
        success: false,
        message: result.message || 'Resume not found'
      });
    }

    // Ensure filePath and fileName exist before downloading
    if (result.filePath && result.fileName) {
      res.download(result.filePath, result.fileName);
    } else {
      res.status(404).json({
        success: false,
        message: 'Resume file not found'
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error downloading resume',
      error: error.message
    });
  }
};