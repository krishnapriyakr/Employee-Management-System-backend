import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  employeeId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: 'id_proof' | 'offer_letter' | 'contract' | 'performance' | 'educational' | 'medical' | 'other';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  expiryDate?: Date;
  uploadedBy: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['id_proof', 'offer_letter', 'contract', 'performance', 'educational', 'medical', 'other'],
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for searching
documentSchema.index({ employeeId: 1, category: 1 });

export default mongoose.model<IDocument>('Document', documentSchema);