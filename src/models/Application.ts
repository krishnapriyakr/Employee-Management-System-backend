import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
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
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  interviewDate?: Date;
  interviewTime?: string;
  interviewType?: 'online' | 'in-person' | 'phone';
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  currentCompany: { type: String, trim: true },
  experience: { type: String, required: true },
  currentSalary: { type: String },
  expectedSalary: { type: String },
  noticePeriod: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  resumeFileName: { type: String, required: true },
  coverLetter: { type: String },
  portfolioUrl: { type: String },
  linkedInUrl: { type: String },
  githubUrl: { type: String },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'rejected', 'hired'],
    default: 'pending'
  },
  rating: { type: Number, min: 1, max: 5 },
  comments: [{ type: String }],
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  interviewDate: { type: Date },
  interviewTime: { type: String },
  interviewType: { type: String, enum: ['online', 'in-person', 'phone'] }
}, { timestamps: true });

applicationSchema.index({ jobId: 1, email: 1 }, { unique: true });

export default mongoose.model<IApplication>('Application', applicationSchema);