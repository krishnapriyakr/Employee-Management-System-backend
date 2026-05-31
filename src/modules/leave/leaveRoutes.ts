import Router from 'express';
import { protect } from '../../middleware/auth';
import { authorize } from '../../middleware/role';  // Now this will work
import * as leaveController from './leaveController';

const router = Router();

// All routes require authentication
router.use(protect);

// Employee routes (accessible by both employee and admin)
router.post('/apply', leaveController.applyForLeave);
router.get('/my-leaves', leaveController.getMyLeaves);
router.get('/my-balance', leaveController.getMyLeaveBalance);

// Admin only routes
router.get('/pending', authorize('admin'), leaveController.getPendingRequests);
router.get('/all', authorize('admin'), leaveController.getAllLeaveRequests);
router.get('/statistics', authorize('admin'), leaveController.getLeaveStatistics);
router.put('/:id/approve', authorize('admin'), leaveController.approveLeave);
router.put('/:id/reject', authorize('admin'), leaveController.rejectLeave);

export default router;