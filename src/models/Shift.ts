import mongoose, { Schema, Document } from 'mongoose';

export interface IShift extends Document {
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const shiftSchema = new Schema<IShift>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 8
  },
  color: {
    type: String,
    default: '#3b82f6'
  }
}, {
  timestamps: true
});

export default mongoose.model<IShift>('Shift', shiftSchema);