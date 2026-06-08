import SalaryStructureModel from '../../models/SalaryStructure';
import PayrollModel from '../../models/Payroll';
import BankDetailsModel from '../../models/BankDetails';
import { Types } from 'mongoose';

// ========== Salary Structure ==========

export const createSalaryStructure = async (data: any): Promise<any> => {
  const salary = new SalaryStructureModel(data);
  return await salary.save();
};

export const findSalaryStructureByEmployee = async (employeeId: string): Promise<any> => {
  return await SalaryStructureModel.findOne({
    employeeId: new Types.ObjectId(employeeId),
    isActive: true
  }).sort({ effectiveFrom: -1 });
};

export const findAllSalaryStructures = async (): Promise<any[]> => {
  return await SalaryStructureModel.find()
    .populate('employeeId', 'name email')
    .sort({ createdAt: -1 });
};

export const updateSalaryStructure = async (id: string, data: any): Promise<any> => {
  return await SalaryStructureModel.findByIdAndUpdate(id, { $set: data }, { new: true });
};

export const deactivateSalaryStructure = async (id: string): Promise<any> => {
  return await SalaryStructureModel.findByIdAndUpdate(id, { $set: { isActive: false } });
};

// ========== Payroll ==========

export const createPayroll = async (data: any): Promise<any> => {
  const payroll = new PayrollModel(data);
  return await payroll.save();
};

export const findPayrollByEmployee = async (employeeId: string, month: number, year: number): Promise<any> => {
  return await PayrollModel.findOne({
    employeeId: new Types.ObjectId(employeeId),
    month,
    year
  });
};

export const findAllPayrolls = async (filters: any): Promise<any[]> => {
  const query: any = {};
  if (filters.month) query.month = filters.month;
  if (filters.year) query.year = filters.year;
  if (filters.status) query.status = filters.status;
  if (filters.employeeId) query.employeeId = new Types.ObjectId(filters.employeeId);
  
  return await PayrollModel.find(query)
    .populate('employeeId', 'name email')
    .populate('processedBy', 'name email')
    .sort({ year: -1, month: -1 });
};

export const updatePayroll = async (id: string, data: any): Promise<any> => {
  return await PayrollModel.findByIdAndUpdate(id, { $set: data }, { new: true });
};

export const getPayrollStats = async (): Promise<any> => {
  const totalProcessed = await PayrollModel.countDocuments({ status: 'processed' });
  const totalPaid = await PayrollModel.countDocuments({ status: 'paid' });
  const totalAmount = await PayrollModel.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$netSalary' } } }
  ]);
  
  return {
    totalProcessed,
    totalPaid,
    totalAmount: totalAmount[0]?.total || 0
  };
};

// ========== Bank Details ==========

export const createBankDetails = async (data: any): Promise<any> => {
  const bankDetails = new BankDetailsModel(data);
  return await bankDetails.save();
};

export const findBankDetailsByEmployee = async (employeeId: string): Promise<any> => {
  return await BankDetailsModel.findOne({ employeeId: new Types.ObjectId(employeeId) });
};

export const updateBankDetails = async (employeeId: string, data: any): Promise<any> => {
  return await BankDetailsModel.findOneAndUpdate(
    { employeeId: new Types.ObjectId(employeeId) },
    { $set: data },
    { new: true, upsert: true }
  );
};