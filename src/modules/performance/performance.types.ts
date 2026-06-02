import { Document, Types } from 'mongoose';

export interface IPerformanceReview extends Document {
  employeeId: Types.ObjectId;
  reviewerId: Types.ObjectId;
  reviewCycle: 'quarterly' | 'annual' | 'probation';
  quarter?: number; // 1,2,3,4
  year: number;
  
  // Self Assessment (Employee)
  selfRating: number; // 1-5
  selfStrengths: string;
  selfWeaknesses: string;
  selfAchievements: string;
  selfGoals: string;
  selfSubmittedAt?: Date;
  
  // Manager Assessment
  managerRating: number; // 1-5
  managerFeedback: string;
  managerStrengths: string;
  managerWeaknesses: string;
  managerRecommendation: 'promote' | 'retain' | 'improvement' | 'terminate';
  managerReviewedAt?: Date;
  
  // Overall Status
  status: 'pending_self' | 'pending_manager' | 'completed';
  finalRating?: number;
  overallComments?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface IGoal extends Document {
  employeeId: Types.ObjectId;
  title: string;
  description: string;
  category: 'technical' | 'soft_skills' | 'leadership' | 'project' | 'behavioral';
  startDate: Date;
  endDate: Date;
  priority: 'high' | 'medium' | 'low';
  progress: number; // 0-100
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewDTO {
  employeeId: string;
  reviewCycle: IPerformanceReview['reviewCycle'];
  quarter?: number;
  year: number;
}

export interface SelfAssessmentDTO {
  selfRating: number;
  selfStrengths: string;
  selfWeaknesses: string;
  selfAchievements: string;
  selfGoals: string;
}

export interface ManagerAssessmentDTO {
  managerRating: number;
  managerFeedback: string;
  managerStrengths: string;
  managerWeaknesses: string;
  managerRecommendation: IPerformanceReview['managerRecommendation'];
}

export interface CreateGoalDTO {
  employeeId: string;
  title: string;
  description: string;
  category: IGoal['category'];
  startDate: Date;
  endDate: Date;
  priority: IGoal['priority'];
}