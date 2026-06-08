import mongoose, { Schema, Document } from 'mongoose';

export interface IBankDetails extends Document {
  employeeId: mongoose.Types.ObjectId;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  branchName: string;
  accountType: 'savings' | 'current';
  upiId?: string;
  panNumber: string;
  aadharNumber: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bankDetailsSchema = new Schema<IBankDetails>({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  accountHolderName: { type: String, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  confirmAccountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  branchName: { type: String, required: true },
  accountType: { type: String, enum: ['savings', 'current'], default: 'savings' },
  upiId: { type: String },
  panNumber: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IBankDetails>('BankDetails', bankDetailsSchema);