import mongoose, { Schema, Document } from 'mongoose';

export interface IPayroll extends Document {
  employeeId: mongoose.Types.ObjectId;
  month: number;
  year: number;
  grossEarnings: {
    basicSalary: number;
    hra: number;
    da: number;
    ca: number;
    specialAllowance: number;
    bonus: number;
    overtimeAmount: number;
    attendanceBonus: number;
    otherEarnings: number;
  };
  deductions: {
    pf: number;
    professionalTax: number;
    tds: number;
    leaveDeductions: number;
    advanceDeduction: number;
    otherDeductions: number;
  };
  netSalary: number;
  attendanceDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  overtimeHours: number;
  status: 'draft' | 'processed' | 'paid';
  processedBy?: mongoose.Types.ObjectId;
  processedAt?: Date;
  paymentDate?: Date;
  paymentMode?: 'bank' | 'cash' | 'cheque';
  transactionId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const payrollSchema = new Schema<IPayroll>({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  grossEarnings: {
    basicSalary: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    da: { type: Number, default: 0 },
    ca: { type: Number, default: 0 },
    specialAllowance: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    overtimeAmount: { type: Number, default: 0 },
    attendanceBonus: { type: Number, default: 0 },
    otherEarnings: { type: Number, default: 0 }
  },
  deductions: {
    pf: { type: Number, default: 0 },
    professionalTax: { type: Number, default: 0 },
    tds: { type: Number, default: 0 },
    leaveDeductions: { type: Number, default: 0 },
    advanceDeduction: { type: Number, default: 0 },
    otherDeductions: { type: Number, default: 0 }
  },
  netSalary: { type: Number, required: true },
  attendanceDays: { type: Number, default: 0 },
  presentDays: { type: Number, default: 0 },
  absentDays: { type: Number, default: 0 },
  leaveDays: { type: Number, default: 0 },
  overtimeHours: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['draft', 'processed', 'paid'],
    default: 'draft'
  },
  processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  processedAt: { type: Date },
  paymentDate: { type: Date },
  paymentMode: { type: String, enum: ['bank', 'cash', 'cheque'] },
  transactionId: { type: String },
  notes: { type: String }
}, { timestamps: true });

payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model<IPayroll>('Payroll', payrollSchema);