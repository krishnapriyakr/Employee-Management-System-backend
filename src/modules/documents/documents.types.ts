import { Document, Types } from 'mongoose';

export interface IDocument extends Document {
  employeeId: Types.ObjectId;
  title: string;
  description: string;
  category: 'id_proof' | 'offer_letter' | 'contract' | 'performance' | 'educational' | 'medical' | 'other';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  expiryDate?: Date;
  uploadedBy: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentDTO {
  employeeId: string;
  title: string;
  description: string;
  category: IDocument['category'];
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  expiryDate?: Date;
}

export interface DocumentFilters {
  employeeId?: string;
  category?: string;
  isActive?: boolean;
}