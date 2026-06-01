import Router from 'express';
import { protect } from '../../middleware/auth';
import { authorize } from '../../middleware/role';
import * as attendanceController from './attendanceController';

const router = Router();

// All routes require authentication
router.use(protect);

// Employee routes
router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);
router.get('/today-status', attendanceController.getTodayStatus);
router.get('/my-attendance', attendanceController.getMyAttendance);

// Admin routes
router.get('/all', authorize('admin'), attendanceController.getAllAttendance);
router.post('/manual-entry', authorize('admin'), attendanceController.manualEntry);
router.put('/:id', authorize('admin'), attendanceController.updateAttendance);
router.get('/stats/dashboard', authorize('admin'), attendanceController.getAttendanceStats);

export default router;