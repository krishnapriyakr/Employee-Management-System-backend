import * as performanceRepository from './performanceRepository';
import { SelfAssessmentDTO, ManagerAssessmentDTO, CreateReviewDTO, CreateGoalDTO } from './performance.types';

// ========== Performance Reviews ==========

export const createReview = async (adminId: string, data: CreateReviewDTO) => {
  try {
    // Check if review already exists for this period
    const existingReviews = await performanceRepository.findAllReviews({
      employeeId: data.employeeId,
      year: data.year,
      reviewCycle: data.reviewCycle,
      quarter: data.quarter
    });
    
    if (existingReviews.length > 0) {
      return {
        success: false,
        message: 'A review already exists for this period'
      };
    }
    
    const review = await performanceRepository.createReview({
      ...data,
      reviewerId: adminId
    });
    
    return {
      success: true,
      message: 'Performance review created successfully',
      data: review
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error creating review',
      error: error.message
    };
  }
};

export const submitSelfAssessment = async (reviewId: string, data: SelfAssessmentDTO) => {
  try {
    const review = await performanceRepository.findReviewById(reviewId);
    
    if (!review) {
      return {
        success: false,
        message: 'Review not found'
      };
    }
    
    if (review.status !== 'pending_self') {
      return {
        success: false,
        message: 'Self assessment already submitted'
      };
    }
    
    const updated = await performanceRepository.updateReview(reviewId, {
      ...data,
      selfSubmittedAt: new Date(),
      status: 'pending_manager'
    });
    
    return {
      success: true,
      message: 'Self assessment submitted successfully',
      data: updated
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error submitting self assessment',
      error: error.message
    };
  }
};

export const submitManagerAssessment = async (reviewId: string, data: ManagerAssessmentDTO) => {
  try {
    const review = await performanceRepository.findReviewById(reviewId);
    
    if (!review) {
      return {
        success: false,
        message: 'Review not found'
      };
    }
    
    if (review.status !== 'pending_manager') {
      return {
        success: false,
        message: 'Manager assessment already submitted or not ready'
      };
    }
    
    const finalRating = (review.selfRating + data.managerRating) / 2;
    
    const updated = await performanceRepository.updateReview(reviewId, {
      ...data,
      managerReviewedAt: new Date(),
      status: 'completed',
      finalRating
    });
    
    return {
      success: true,
      message: 'Manager assessment submitted successfully',
      data: updated
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error submitting manager assessment',
      error: error.message
    };
  }
};

export const getMyReviews = async (employeeId: string) => {
  try {
    const reviews = await performanceRepository.findReviewsByEmployee(employeeId);
    
    return {
      success: true,
      data: reviews
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    };
  }
};

export const getPendingReviews = async () => {
  try {
    const reviews = await performanceRepository.findPendingManagerReviews();
    
    return {
      success: true,
      data: reviews
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching pending reviews',
      error: error.message
    };
  }
};

export const getAllReviews = async (filters: any) => {
  try {
    const reviews = await performanceRepository.findAllReviews(filters);
    
    return {
      success: true,
      data: reviews
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    };
  }
};

// ========== Goals ==========

export const createGoal = async (adminId: string, data: CreateGoalDTO) => {
  try {
    const goal = await performanceRepository.createGoal({
      ...data,
      createdBy: adminId
    });
    
    return {
      success: true,
      message: 'Goal created successfully',
      data: goal
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error creating goal',
      error: error.message
    };
  }
};

export const getMyGoals = async (employeeId: string) => {
  try {
    const goals = await performanceRepository.findGoalsByEmployee(employeeId);
    
    return {
      success: true,
      data: goals
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching goals',
      error: error.message
    };
  }
};

export const updateGoalProgress = async (goalId: string, progress: number) => {
  try {
    let status = 'in_progress';
    if (progress === 0) status = 'not_started';
    if (progress === 100) status = 'completed';
    
    const goal = await performanceRepository.updateGoal(goalId, {
      progress,
      status
    });
    
    if (!goal) {
      return {
        success: false,
        message: 'Goal not found'
      };
    }
    
    return {
      success: true,
      message: 'Goal progress updated',
      data: goal
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error updating goal',
      error: error.message
    };
  }
};

export const getAllGoals = async (filters: any) => {
  try {
    const goals = await performanceRepository.findAllGoals(filters);
    
    return {
      success: true,
      data: goals
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching goals',
      error: error.message
    };
  }
};

export const deleteGoal = async (goalId: string) => {
  try {
    const goal = await performanceRepository.deleteGoal(goalId);
    
    if (!goal) {
      return {
        success: false,
        message: 'Goal not found'
      };
    }
    
    return {
      success: true,
      message: 'Goal deleted successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error deleting goal',
      error: error.message
    };
  }
};

export const getPerformanceStats = async () => {
  try {
    const allReviews = await performanceRepository.findAllReviews({});
    
    const completed = allReviews.filter(r => r.status === 'completed');
    const avgRating = completed.length > 0 
      ? completed.reduce((sum, r) => sum + (r.finalRating || 0), 0) / completed.length
      : 0;
    
    const recommendations = {
      promote: allReviews.filter(r => r.managerRecommendation === 'promote').length,
      retain: allReviews.filter(r => r.managerRecommendation === 'retain').length,
      improvement: allReviews.filter(r => r.managerRecommendation === 'improvement').length,
      terminate: allReviews.filter(r => r.managerRecommendation === 'terminate').length
    };
    
    return {
      success: true,
      data: {
        total: allReviews.length,
        pendingSelf: allReviews.filter(r => r.status === 'pending_self').length,
        pendingManager: allReviews.filter(r => r.status === 'pending_manager').length,
        completed: completed.length,
        averageRating: parseFloat(avgRating.toFixed(1)),
        recommendations
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching stats',
      error: error.message
    };
  }
};