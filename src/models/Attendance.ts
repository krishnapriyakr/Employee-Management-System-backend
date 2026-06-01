import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  employeeId: mongoose.Types.ObjectId;
  date: Date;
  checkInTime: Date;
  checkOutTime?: Date;
  totalHours?: number;
  status: 'present' | 'late' | 'half-day' | 'absent';
  isLate: boolean;
  lateMinutes?: number;
  ipAddress?: string;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    default: () => new Date(),
    index: true
  },
  checkInTime: {
    type: Date,
    required: true
  },
  checkOutTime: {
    type: Date
  },
  totalHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['present', 'late', 'half-day', 'absent'],
    default: 'present'
  },
  isLate: {
    type: Boolean,
    default: false
  },
  lateMinutes: {
    type: Number,
    default: 0
  },
  ipAddress: {
    type: String
  },
  location: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index for unique attendance per employee per day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);