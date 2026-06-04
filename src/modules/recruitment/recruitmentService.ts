import fs from 'fs';
import path from 'path';
import * as recruitmentRepository from './recruitmentRepository';
import { CreateJobDTO, CreateApplicationDTO } from './recruitment.types';

const RESUME_UPLOAD_DIR = path.join(__dirname, '../../../uploads/resumes');

if (!fs.existsSync(RESUME_UPLOAD_DIR)) {
  fs.mkdirSync(RESUME_UPLOAD_DIR, { recursive: true });
}

const generateFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const extension = path.extname(originalName);
  return `${timestamp}_${random}${extension}`;
};

// ========== Jobs ==========

export const createJob = async (adminId: string, data: CreateJobDTO) => {
  try {
    const job = await recruitmentRepository.createJob({ ...data, postedBy: adminId });
    
    return {
      success: true,
      message: 'Job posted successfully',
      data: job
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error creating job',
      error: error.message
    };
  }
};

export const getAllJobs = async (filters: any, isPublic: boolean = false) => {
  try {
    const jobs = await recruitmentRepository.findAllJobs(filters, isPublic);
    
    return {
      success: true,
      data: jobs
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    };
  }
};

export const getJobById = async (id: string, incrementView: boolean = false) => {
  try {
    if (incrementView) {
      await recruitmentRepository.incrementJobViews(id);
    }
    
    const job = await recruitmentRepository.findJobById(id);
    
    if (!job) {
      return {
        success: false,
        message: 'Job not found'
      };
    }
    
    return {
      success: true,
      data: job
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching job',
      error: error.message
    };
  }
};

export const updateJob = async (id: string, updateData: any) => {
  try {
    const job = await recruitmentRepository.updateJob(id, updateData);
    
    if (!job) {
      return {
        success: false,
        message: 'Job not found'
      };
    }
    
    return {
      success: true,
      message: 'Job updated successfully',
      data: job
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error updating job',
      error: error.message
    };
  }
};

export const deleteJob = async (id: string) => {
  try {
    const job = await recruitmentRepository.deleteJob(id);
    
    if (!job) {
      return {
        success: false,
        message: 'Job not found'
      };
    }
    
    return {
      success: true,
      message: 'Job deleted successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error deleting job',
      error: error.message
    };
  }
};

// ========== Applications ==========

export const applyForJob = async (jobId: string, applicationData: CreateApplicationDTO, file: Express.Multer.File) => {
  try {
    if (!file) {
      return {
        success: false,
        message: 'Resume file is required'
      };
    }
    
    // Check if already applied
    const existing = await recruitmentRepository.checkExistingApplication(jobId, applicationData.email);
    if (existing) {
      return {
        success: false,
        message: 'You have already applied for this position'
      };
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.mimetype)) {
      return {
        success: false,
        message: 'Invalid file type. Allowed: PDF, DOC, DOCX'
      };
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message: 'File size cannot exceed 5MB'
      };
    }
    
    const fileName = generateFileName(file.originalname);
    const filePath = path.join(RESUME_UPLOAD_DIR, fileName);
    
    fs.writeFileSync(filePath, file.buffer);
    const resumeUrl = `/uploads/resumes/${fileName}`;
    
    const application = await recruitmentRepository.createApplication({
      ...applicationData,
      jobId,
      resumeUrl,
      resumeFileName: file.originalname
    });
    
    // Increment application count on job
    const job = await recruitmentRepository.findJobById(jobId);
    if (job) {
      await recruitmentRepository.updateJob(jobId, { applications: (job.applications || 0) + 1 });
    }
    
    return {
      success: true,
      message: 'Application submitted successfully',
      data: application
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error submitting application',
      error: error.message
    };
  }
};

export const getAllApplications = async (filters: any) => {
  try {
    const applications = await recruitmentRepository.findAllApplications(filters);
    
    return {
      success: true,
      data: applications
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching applications',
      error: error.message
    };
  }
};

export const getApplicationById = async (id: string) => {
  try {
    const application = await recruitmentRepository.findApplicationById(id);
    
    if (!application) {
      return {
        success: false,
        message: 'Application not found'
      };
    }
    
    return {
      success: true,
      data: application
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching application',
      error: error.message
    };
  }
};

export const updateApplicationStatus = async (id: string, adminId: string, status: string, comments?: string) => {
  try {
    const application = await recruitmentRepository.updateApplicationStatus(id, status, adminId, comments);
    
    if (!application) {
      return {
        success: false,
        message: 'Application not found'
      };
    }
    
    return {
      success: true,
      message: `Application ${status} successfully`,
      data: application
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error updating application status',
      error: error.message
    };
  }
};

export const scheduleInterview = async (id: string, interviewData: { interviewDate: Date, interviewTime: string, interviewType: string }) => {
  try {
    const application = await recruitmentRepository.updateApplication(id, {
      interviewDate: new Date(interviewData.interviewDate),
      interviewTime: interviewData.interviewTime,
      interviewType: interviewData.interviewType,
      status: 'interviewed'
    });
    
    if (!application) {
      return {
        success: false,
        message: 'Application not found'
      };
    }
    
    return {
      success: true,
      message: 'Interview scheduled successfully',
      data: application
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error scheduling interview',
      error: error.message
    };
  }
};

export const getApplicationStats = async () => {
  try {
    const stats = await recruitmentRepository.getApplicationStats();
    
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

export const downloadResume = async (applicationId: string) => {
  try {
    const application = await recruitmentRepository.findApplicationById(applicationId);
    
    if (!application) {
      return {
        success: false,
        message: 'Application not found'
      };
    }
    
    const filePath = path.join(RESUME_UPLOAD_DIR, path.basename(application.resumeUrl));
    
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        message: 'Resume file not found'
      };
    }
    
    return {
      success: true,
      filePath,
      fileName: application.resumeFileName
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error downloading resume',
      error: error.message
    };
  }
};