import mongoose, { Schema, Document } from 'mongoose';

export interface ISalaryStructure extends Document {
  employeeId: mongoose.Types.ObjectId;
  basicSalary: number;
  hra: number; // House Rent Allowance
  da: number; // Dearness Allowance
  ca: number; // Conveyance Allowance
  specialAllowance: number;
  bonus: number;
  pf: number; // Provident Fund
  professionalTax: number;
  tds: number; // Tax Deducted at Source
  otherDeductions: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const salaryStructureSchema = new Schema<ISalaryStructure>({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  basicSalary: { type: Number, required: true, default: 0 },
  hra: { type: Number, default: 0 },
  da: { type: Number, default: 0 },
  ca: { type: Number, default: 0 },
  specialAllowance: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  pf: { type: Number, default: 0 },
  professionalTax: { type: Number, default: 0 },
  tds: { type: Number, default: 0 },
  otherDeductions: { type: Number, default: 0 },
  effectiveFrom: { type: Date, required: true },
  effectiveTo: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<ISalaryStructure>('SalaryStructure', salaryStructureSchema);