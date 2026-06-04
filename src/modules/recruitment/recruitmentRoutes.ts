import Router from 'express';
import multer from 'multer';
import { protect } from '../../middleware/auth';
import { authorize } from '../../middleware/role';
import * as recruitmentController from './recruitmentController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// ========== Public Routes (No Auth Required) ==========
router.get('/jobs/public', recruitmentController.getAllJobs);
router.get('/jobs/public/:id', recruitmentController.getJobById);
router.post('/jobs/:jobId/apply', upload.single('resume'), recruitmentController.applyForJob);

// ========== Admin Routes ==========
// Jobs
router.post('/jobs', protect, authorize('admin'), recruitmentController.createJob);
router.get('/jobs', protect, authorize('admin'), recruitmentController.getAllJobs);
router.get('/jobs/:id', protect, authorize('admin'), recruitmentController.getJobById);
router.put('/jobs/:id', protect, authorize('admin'), recruitmentController.updateJob);
router.delete('/jobs/:id', protect, authorize('admin'), recruitmentController.deleteJob);

// Applications
router.get('/applications', protect, authorize('admin'), recruitmentController.getAllApplications);
router.get('/applications/stats', protect, authorize('admin'), recruitmentController.getApplicationStats);
router.get('/applications/:id', protect, authorize('admin'), recruitmentController.getApplicationById);
router.put('/applications/:id/status', protect, authorize('admin'), recruitmentController.updateApplicationStatus);
router.put('/applications/:id/schedule-interview', protect, authorize('admin'), recruitmentController.scheduleInterview);
router.get('/applications/:id/resume', protect, authorize('admin'), recruitmentController.downloadResume);

export default router;