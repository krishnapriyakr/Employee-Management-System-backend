import mongoose, { Schema, Document } from 'mongoose';

export interface IShiftAssignment extends Document {
  employeeId: mongoose.Types.ObjectId;
  shiftId: mongoose.Types.ObjectId;
  date: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'swap_requested';
  swapRequestId?: mongoose.Types.ObjectId;
  swapWithEmployeeId?: mongoose.Types.ObjectId;
  swapStatus?: 'pending' | 'approved' | 'rejected';
  overtimeHours: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const shiftAssignmentSchema = new Schema<IShiftAssignment>({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shiftId: {
    type: Schema.Types.ObjectId,
    ref: 'Shift',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'swap_requested'],
    default: 'scheduled'
  },
  swapRequestId: {
    type: Schema.Types.ObjectId
  },
  swapWithEmployeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  swapStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected']
  },
  overtimeHours: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

shiftAssignmentSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export default mongoose.model<IShiftAssignment>('ShiftAssignment', shiftAssignmentSchema);