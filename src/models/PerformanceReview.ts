import mongoose, { Schema, Document } from 'mongoose';

export interface IPerformanceReview extends Document {
  employeeId: mongoose.Types.ObjectId;
  reviewerId: mongoose.Types.ObjectId;
  reviewCycle: 'quarterly' | 'annual' | 'probation';
  quarter?: number;
  year: number;
  
  selfRating: number;
  selfStrengths: string;
  selfWeaknesses: string;
  selfAchievements: string;
  selfGoals: string;
  selfSubmittedAt?: Date;
  
  managerRating: number;
  managerFeedback: string;
  managerStrengths: string;
  managerWeaknesses: string;
  managerRecommendation: 'promote' | 'retain' | 'improvement' | 'terminate';
  managerReviewedAt?: Date;
  
  status: 'pending_self' | 'pending_manager' | 'completed';
  finalRating?: number;
  overallComments?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const performanceReviewSchema = new Schema<IPerformanceReview>({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewCycle: {
    type: String,
    enum: ['quarterly', 'annual', 'probation'],
    required: true
  },
  quarter: {
    type: Number,
    min: 1,
    max: 4
  },
  year: {
    type: Number,
    required: true
  },
  selfRating: {
    type: Number,
    min: 1,
    max: 5
  },
  selfStrengths: String,
  selfWeaknesses: String,
  selfAchievements: String,
  selfGoals: String,
  selfSubmittedAt: Date,
  managerRating: {
    type: Number,
    min: 1,
    max: 5
  },
  managerFeedback: String,
  managerStrengths: String,
  managerWeaknesses: String,
  managerRecommendation: {
    type: String,
    enum: ['promote', 'retain', 'improvement', 'terminate']
  },
  managerReviewedAt: Date,
  status: {
    type: String,
    enum: ['pending_self', 'pending_manager', 'completed'],
    default: 'pending_self'
  },
  finalRating: Number,
  overallComments: String
}, {
  timestamps: true
});

export default mongoose.model<IPerformanceReview>('PerformanceReview', performanceReviewSchema);