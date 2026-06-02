import mongoose, { Types } from 'mongoose';
import PerformanceReviewModel from '../../models/PerformanceReview';
import GoalModel from '../../models/Goal';
import { CreateReviewDTO, CreateGoalDTO } from './performance.types';

// ========== Performance Reviews ==========

export const createReview = async (data: CreateReviewDTO & { reviewerId: string }): Promise<any> => {
  const review = new PerformanceReviewModel({
    ...data,
    employeeId: new Types.ObjectId(data.employeeId),
    reviewerId: new Types.ObjectId(data.reviewerId)
  });
  return await review.save();
};

export const findReviewById = async (id: string): Promise<any> => {
  return await PerformanceReviewModel.findById(id)
    .populate('employeeId', 'name email')
    .populate('reviewerId', 'name email');
};

export const findReviewsByEmployee = async (employeeId: string): Promise<any[]> => {
  return await PerformanceReviewModel.find({ 
    employeeId: new Types.ObjectId(employeeId) 
  })
    .populate('reviewerId', 'name email')
    .sort({ year: -1, quarter: -1 });
};

export const findAllReviews = async (filters: any): Promise<any[]> => {
  const query: any = {};
  
  if (filters.employeeId) {
    query.employeeId = new Types.ObjectId(filters.employeeId);
  }
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.year) {
    query.year = filters.year;
  }
  if (filters.reviewCycle) {
    query.reviewCycle = filters.reviewCycle;
  }
  
  return await PerformanceReviewModel.find(query)
    .populate('employeeId', 'name email')
    .populate('reviewerId', 'name email')
    .sort({ year: -1, quarter: -1 });
};

export const updateReview = async (id: string, updateData: any): Promise<any> => {
  return await PerformanceReviewModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

export const findPendingManagerReviews = async (): Promise<any[]> => {
  return await PerformanceReviewModel.find({ status: 'pending_manager' })
    .populate('employeeId', 'name email')
    .populate('reviewerId', 'name email')
    .sort({ createdAt: 1 });
};

// ========== Goals ==========

export const createGoal = async (data: CreateGoalDTO & { createdBy: string }): Promise<any> => {
  const goal = new GoalModel({
    ...data,
    employeeId: new Types.ObjectId(data.employeeId),
    createdBy: new Types.ObjectId(data.createdBy)
  });
  return await goal.save();
};

export const findGoalById = async (id: string): Promise<any> => {
  return await GoalModel.findById(id)
    .populate('employeeId', 'name email')
    .populate('createdBy', 'name email');
};

export const findGoalsByEmployee = async (employeeId: string): Promise<any[]> => {
  return await GoalModel.find({ 
    employeeId: new Types.ObjectId(employeeId) 
  })
    .sort({ priority: -1, endDate: 1 });
};

export const findAllGoals = async (filters: any): Promise<any[]> => {
  const query: any = {};
  
  if (filters.employeeId) {
    query.employeeId = new Types.ObjectId(filters.employeeId);
  }
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.category) {
    query.category = filters.category;
  }
  
  return await GoalModel.find(query)
    .populate('employeeId', 'name email')
    .populate('createdBy', 'name email')
    .sort({ endDate: 1 });
};

export const updateGoal = async (id: string, updateData: any): Promise<any> => {
  return await GoalModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

export const deleteGoal = async (id: string): Promise<any> => {
  return await GoalModel.findByIdAndDelete(id);
};