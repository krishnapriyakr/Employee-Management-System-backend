import Router from 'express';
import * as employeesController from './employeesController';
import { protect } from '../../middleware/auth';

const router = Router();

// Create a new employee
router.post('/',protect, employeesController.createEmployee);

// Update an existing employee
router.put('/:id',protect, employeesController.updateEmployee);

// Get an employee by ID
router.get('/:id',protect, employeesController.getEmployeeById);

// Get all employees
router.get('/',protect, employeesController.getAllEmployees);

// Delete an employee
router.delete('/:id',protect, employeesController.deleteEmployee);

// Get dashboard statistics
router.get('/stats/dashboard',protect, employeesController.getDashboardStats);

export default router;