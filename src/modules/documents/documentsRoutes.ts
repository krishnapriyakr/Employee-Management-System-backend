import Router from 'express';
import multer from 'multer';
import { protect, AuthRequest } from '../../middleware/auth';
import { authorize } from '../../middleware/role';
import * as documentsController from './documentsController';

const router = Router();

// Configure multer for memory storage with file filter
const storage = multer.memoryStorage();

// File filter to validate file types
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: PDF, JPEG, PNG, DOC, DOCX'));
  }
};

// Multer configuration with limits
const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Error handling wrapper for multer
// Simpler error handling wrapper
const handleMulterError = (err: any, req: AuthRequest, res: any, next: any) => {
  if (err) {
    let message = err.message;
    
    // Check for file too large error
    if (err.code === 'FILE_TOO_LARGE' || err.message?.includes('too large')) {
      message = 'File too large. Maximum size is 10MB';
    }
    
    return res.status(400).json({
      success: false,
      message: message
    });
  }
  next();
};
// All routes require authentication
router.use(protect);

// Employee routes
router.get('/my', documentsController.getMyDocuments);
router.get('/download/:id', documentsController.downloadDocument);

// Admin routes
router.post(
  '/upload',
  authorize('admin'),
  upload.single('file'),
  handleMulterError,
  documentsController.uploadDocument
);
router.get('/all', authorize('admin'), documentsController.getAllDocuments);
router.get('/employee/:employeeId', authorize('admin'), documentsController.getEmployeeDocuments);
router.get('/stats', authorize('admin'), documentsController.getDocumentStats);
router.delete('/:id', authorize('admin'), documentsController.deleteDocument);

export default router;