import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as payrollService from './payrollService';

// ========== Salary Structure ==========

export const createSalaryStructure = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const result = await payrollService.createSalaryStructure(req.user.userId, req.body);
    if (!result.success) return res.status(400).json(result);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeSalaryStructure = async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId } = req.params;
    const result = await payrollService.getEmployeeSalaryStructure(employeeId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllSalaryStructures = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    const result = await payrollService.getAllSalaryStructures();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== Payroll ==========

export const processPayroll = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { employeeId, month, year } = req.body;
    const result = await payrollService.processPayroll(req.user.userId, employeeId, month, year);
    if (!result.success) return res.status(400).json(result);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const processAllPayroll = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { month, year } = req.body;
    const result = await payrollService.processAllPayroll(req.user.userId, month, year);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyPayroll = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { month, year } = req.query;
    const result = await payrollService.getMyPayroll(
      req.user.userId,
      month ? parseInt(month as string) : undefined,
      year ? parseInt(year as string) : undefined
    );
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPayrolls = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { month, year, status, employeeId } = req.query;
    const result = await payrollService.getAllPayrolls({ month, year, status, employeeId });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePayrollStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { id } = req.params;
    const { status, paymentMode, transactionId } = req.body;
    const result = await payrollService.updatePayrollStatus(id, status, paymentMode, transactionId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPayrollStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const result = await payrollService.getPayrollStats();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== Bank Details ==========

export const saveBankDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const result = await payrollService.saveBankDetails(req.user.userId, req.body);
    if (!result.success) return res.status(400).json(result);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBankDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const result = await payrollService.getBankDetails(req.user.userId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeBankDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { employeeId } = req.params;
    const result = await payrollService.getBankDetails(employeeId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};