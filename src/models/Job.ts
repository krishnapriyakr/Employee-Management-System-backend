import mongoose, { Schema, Document } from 'mongoose';

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
  postedBy: mongoose.Types.ObjectId;
  postedDate: Date;
  lastDate: Date;
  views: number;
  applications: number;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>({
  title: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true
  },
  experience: { type: String, required: true },
  salaryRange: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  benefits: [{ type: String }],
  status: {
    type: String,
    enum: ['open', 'closed', 'on-hold'],
    default: 'open'
  },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postedDate: { type: Date, default: Date.now },
  lastDate: { type: Date, required: true },
  views: { type: Number, default: 0 },
  applications: { type: Number, default: 0 }
}, { timestamps: true });

// Index for search
jobSchema.index({ title: 'text', description: 'text', department: 'text' });

export default mongoose.model<IJob>('Job', jobSchema);