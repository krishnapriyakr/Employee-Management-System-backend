import mongoose, { Schema, Document } from 'mongoose';

export interface ISwapRequest extends Document {
  assignmentId: mongoose.Types.ObjectId;
  fromEmployeeId: mongoose.Types.ObjectId;
  toEmployeeId: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const swapRequestSchema = new Schema<ISwapRequest>({
  assignmentId: {
    type: Schema.Types.ObjectId,
    ref: 'ShiftAssignment',
    required: true
  },
  fromEmployeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toEmployeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    required: true
  },
  respondedAt: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model<ISwapRequest>('SwapRequest', swapRequestSchema);