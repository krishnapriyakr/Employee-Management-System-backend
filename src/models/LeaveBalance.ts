import mongoose, { Document, Schema } from 'mongoose';

export interface ILeaveBalance extends Document {
  employeeId: mongoose.Types.ObjectId;
  annual: number;      // Annual leave (12 days default)
  sick: number;        // Sick leave (10 days default)
  casual: number;      // Casual leave (5 days default)
  unpaid: number;      // Unpaid leave taken
  year: number;
  lastUpdated: Date;
}

const leaveBalanceSchema = new Schema<ILeaveBalance>({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  annual: {
    type: Number,
    default: 12,
    min: 0
  },
  sick: {
    type: Number,
    default: 10,
    min: 0
  },
  casual: {
    type: Number,
    default: 5,
    min: 0
  },
  unpaid: {
    type: Number,
    default: 0,
    min: 0
  },
  year: {
    type: Number,
    default: new Date().getFullYear()
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<ILeaveBalance>('LeaveBalance', leaveBalanceSchema);