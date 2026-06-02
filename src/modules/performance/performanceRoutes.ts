import Router from 'express';
import { protect } from '../../middleware/auth';
import { authorize } from '../../middleware/role';
import * as performanceController from './performanceController';

const router = Router();

// All routes require authentication
router.use(protect);

// ========== Performance Reviews ==========
router.post('/reviews', authorize('admin'), performanceController.createReview);
router.put('/reviews/:id/self', performanceController.submitSelfAssessment);
router.put('/reviews/:id/manager', authorize('admin'), performanceController.submitManagerAssessment);
router.get('/reviews/my', performanceController.getMyReviews);
router.get('/reviews/pending', authorize('admin'), performanceController.getPendingReviews);
router.get('/reviews/all', authorize('admin'), performanceController.getAllReviews);
router.get('/stats', authorize('admin'), performanceController.getPerformanceStats);

// ========== Goals ==========
router.post('/goals', authorize('admin'), performanceController.createGoal);
router.get('/goals/my', performanceController.getMyGoals);
router.put('/goals/:id/progress', performanceController.updateGoalProgress);
router.get('/goals/all', authorize('admin'), performanceController.getAllGoals);
router.delete('/goals/:id', authorize('admin'), performanceController.deleteGoal);

export default router;