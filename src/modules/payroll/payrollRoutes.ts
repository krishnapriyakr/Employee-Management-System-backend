import Router from 'express';
import { protect } from '../../middleware/auth';
import { authorize } from '../../middleware/role';
import * as payrollController from './payrollController';

const router = Router();

router.use(protect);

// ========== Salary Structure (Admin Only) ==========
router.post('/salary-structure', authorize('admin'), payrollController.createSalaryStructure);
router.get('/salary-structures', authorize('admin'), payrollController.getAllSalaryStructures);
router.get('/salary-structure/:employeeId', authorize('admin'), payrollController.getEmployeeSalaryStructure);

// ========== Payroll ==========
router.post('/process', authorize('admin'), payrollController.processPayroll);
router.post('/process-all', authorize('admin'), payrollController.processAllPayroll);
router.get('/my-payroll', payrollController.getMyPayroll);
router.get('/all', authorize('admin'), payrollController.getAllPayrolls);
router.put('/:id/status', authorize('admin'), payrollController.updatePayrollStatus);
router.get('/stats', authorize('admin'), payrollController.getPayrollStats);

// ========== Bank Details ==========
router.post('/bank-details', payrollController.saveBankDetails);
router.get('/bank-details', payrollController.getBankDetails);
router.get('/bank-details/:employeeId', authorize('admin'), payrollController.getEmployeeBankDetails);

export default router;