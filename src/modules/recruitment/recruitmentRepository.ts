import mongoose, { Types } from 'mongoose';
import JobModel from '../../models/Job';
import ApplicationModel from '../../models/Application';
import { CreateJobDTO, CreateApplicationDTO } from './recruitment.types';

// ========== Jobs ==========

export const createJob = async (data: CreateJobDTO & { postedBy: string }): Promise<any> => {
  const job = new JobModel({
    ...data,
    postedBy: new Types.ObjectId(data.postedBy),
    lastDate: new Date(data.lastDate)
  });
  return await job.save();
};

export const findJobById = async (id: string): Promise<any> => {
  return await JobModel.findById(id).populate('postedBy', 'name email');
};

export const findAllJobs = async (filters: any, isPublic: boolean = false): Promise<any[]> => {
  const query: any = {};
  
  if (isPublic) {
    query.status = 'open';
  }
  if (filters.department) {
    query.department = filters.department;
  }
  if (filters.employmentType) {
    query.employmentType = filters.employmentType;
  }
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  return await JobModel.find(query)
    .populate('postedBy', 'name')
    .sort({ postedDate: -1 });
};

export const updateJob = async (id: string, updateData: any): Promise<any> => {
  return await JobModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

export const deleteJob = async (id: string): Promise<any> => {
  return await JobModel.findByIdAndDelete(id);
};

export const incrementJobViews = async (id: string): Promise<void> => {
  await JobModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
};

// ========== Applications ==========

export const createApplication = async (data: CreateApplicationDTO & { resumeUrl: string, resumeFileName: string }): Promise<any> => {
  const application = new ApplicationModel({
    ...data,
    jobId: new Types.ObjectId(data.jobId)
  });
  return await application.save();
};

export const findApplicationById = async (id: string): Promise<any> => {
  return await ApplicationModel.findById(id)
    .populate('jobId')
    .populate('reviewedBy', 'name email');
};

export const findAllApplications = async (filters: any): Promise<any[]> => {
  const query: any = {};
  
  if (filters.jobId) {
    query.jobId = new Types.ObjectId(filters.jobId);
  }
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.search) {
    query.$or = [
      { firstName: { $regex: filters.search, $options: 'i' } },
      { lastName: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } }
    ];
  }
  
  return await ApplicationModel.find(query)
    .populate('jobId')
    .populate('reviewedBy', 'name email')
    .sort({ createdAt: -1 });
};

export const findApplicationsByJob = async (jobId: string): Promise<any[]> => {
  return await ApplicationModel.find({ jobId: new Types.ObjectId(jobId) })
    .sort({ createdAt: -1 });
};

export const updateApplication = async (id: string, updateData: any): Promise<any> => {
  return await ApplicationModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

export const updateApplicationStatus = async (id: string, status: string, reviewedBy: string, comments?: string): Promise<any> => {
  return await ApplicationModel.findByIdAndUpdate(
    id,
    {
      $set: {
        status,
        reviewedBy: new Types.ObjectId(reviewedBy),
        reviewedAt: new Date()
      },
      $push: { comments: comments }
    },
    { new: true }
  );
};

export const getApplicationStats = async (): Promise<any> => {
  const total = await ApplicationModel.countDocuments();
  const pending = await ApplicationModel.countDocuments({ status: 'pending' });
  const shortlisted = await ApplicationModel.countDocuments({ status: 'shortlisted' });
  const hired = await ApplicationModel.countDocuments({ status: 'hired' });
  const rejected = await ApplicationModel.countDocuments({ status: 'rejected' });
  
  return { total, pending, shortlisted, hired, rejected };
};

export const checkExistingApplication = async (jobId: string, email: string): Promise<boolean> => {
  const existing = await ApplicationModel.findOne({
    jobId: new Types.ObjectId(jobId),
    email: email.toLowerCase()
  });
  return !!existing;
};