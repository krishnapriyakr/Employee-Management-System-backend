import Router from 'express';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/role';
import * as exportController from '../export/exportController';

const router = Router();

router.use(protect);
router.use(authorize('admin')); // All export routes are admin-only

// Employee Reports
router.get('/employees/excel', exportController.exportEmployeesExcel);
router.get('/employees/pdf', exportController.exportEmployeesPDF);

// Attendance Report
router.get('/attendance/excel', exportController.exportAttendanceExcel);

// Leave Report
router.get('/leave/excel', exportController.exportLeaveExcel);

// Payroll Reports
router.get('/payroll/excel', exportController.exportPayrollExcel);
router.get('/payroll/pdf', exportController.exportPayrollPDF);

export default router;