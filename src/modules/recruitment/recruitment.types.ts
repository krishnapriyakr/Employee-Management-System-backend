import { Document, Types } from 'mongoose';

export interface IJob extends Document {
  title: string;
  department: string;
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: string;
  salaryRange: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  status: 'open' | 'closed' | 'on-hold';
  postedBy: Types.ObjectId;
  postedDate: Date;
  lastDate: Date;
  views: number;
  applications: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApplication extends Document {
  jobId: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentCompany?: string;
  experience: string;
  currentSalary?: string;
  expectedSalary?: string;
  noticePeriod: string;
  resumeUrl: string;
  resumeFileName: string;
  coverLetter?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired';
  rating?: number;
  comments?: string[];
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  interviewDate?: Date;
  interviewTime?: string;
  interviewType?: 'online' | 'in-person' | 'phone';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobDTO {
  title: string;
  department: string;
  location: string;
  employmentType: IJob['employmentType'];
  experience: string;
  salaryRange: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  lastDate: Date;
}

export interface CreateApplicationDTO {
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentCompany?: string;
  experience: string;
  currentSalary?: string;
  expectedSalary?: string;
  noticePeriod: string;
  coverLetter?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  githubUrl?: string;
}