import Router from 'express';
import { protect } from '../../middleware/auth';
import { authorize } from '../../middleware/role';
import * as shiftController from './shiftController';

const router = Router();

// All routes require authentication
router.use(protect);

// ========== Shift Templates (Admin Only) ==========
router.post('/shifts', authorize('admin'), shiftController.createShift);
router.get('/shifts', shiftController.getAllShifts);
router.put('/shifts/:id', authorize('admin'), shiftController.updateShift);
router.delete('/shifts/:id', authorize('admin'), shiftController.deleteShift);

// ========== Shift Assignments ==========
router.post('/assign', authorize('admin'), shiftController.assignShift);
router.get('/my-shifts', shiftController.getMyShifts);
router.get('/today', authorize('admin'), shiftController.getTodaysShifts);
router.put('/assignments/:id/status', shiftController.updateShiftStatus);
router.get('/assignments', authorize('admin'), shiftController.getAllAssignments);

// ========== Swap Requests ==========
router.post('/swap/request', shiftController.requestSwap);
router.get('/swap/my-requests', shiftController.getMySwapRequests);
router.put('/swap/:id/respond', shiftController.respondToSwap);

// ========== Statistics ==========
router.get('/stats', authorize('admin'), shiftController.getShiftStats);
router.get('/monthly-summary', shiftController.getMonthlySummary);

export default router;