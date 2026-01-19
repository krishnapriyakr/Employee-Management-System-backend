import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as employeesService from './employeesService'; 

export const createEmployee = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const employeeData = req.body;
    const result = await employeesService.createEmployee(employeeData, req.user.userId); // ✅ Use named export

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating employee',
      error: error.message
    });
  }
};

export const updateEmployee = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const result = await employeesService.updateEmployee(id, updateData); // ✅ Use named export

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating employee',
      error: error.message
    });
  }
};

export const getEmployeeById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { id } = req.params;
    const result = await employeesService.getEmployeeById(id); // ✅ Use named export

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employee',
      error: error.message
    });
  }
};

export const getAllEmployees = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { page = 1, limit = 10, search = '', department = '' } = req.query;
    
    const result = await employeesService.getAllEmployees( // ✅ Use named export
      Number(page),
      Number(limit),
      search as string,
      department as string
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employees',
      error: error.message
    });
  }
};

export const deleteEmployee = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { id } = req.params;
    const result = await employeesService.deleteEmployee(id); // ✅ Use named export

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting employee',
      error: error.message
    });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const result = await employeesService.getDashboardStats(); // ✅ Use named export
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};