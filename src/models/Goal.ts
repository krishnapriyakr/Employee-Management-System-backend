import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  employeeId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: 'technical' | 'soft_skills' | 'leadership' | 'project' | 'behavioral';
  startDate: Date;
  endDate: Date;
  priority: 'high' | 'medium' | 'low';
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['technical', 'soft_skills', 'leadership', 'project', 'behavioral'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'cancelled'],
    default: 'not_started'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IGoal>('Goal', goalSchema);