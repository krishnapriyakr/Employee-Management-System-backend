import mongoose, { Types } from 'mongoose';
import DocumentModel from '../../models/Document';
import { CreateDocumentDTO, DocumentFilters } from './documents.types';

export const createDocument = async (data: CreateDocumentDTO & { uploadedBy: string }): Promise<any> => {
  const document = new DocumentModel({
    ...data,
    employeeId: new Types.ObjectId(data.employeeId),
    uploadedBy: new Types.ObjectId(data.uploadedBy)
  });
  return await document.save();
};

export const findDocumentById = async (id: string): Promise<any> => {
  return await DocumentModel.findById(id)
    .populate('employeeId', 'name email')
    .populate('uploadedBy', 'name email');
};

export const findDocumentsByEmployee = async (employeeId: string): Promise<any[]> => {
  return await DocumentModel.find({ 
    employeeId: new Types.ObjectId(employeeId),
    isActive: true
  })
    .sort({ createdAt: -1 });
};

export const findAllDocuments = async (filters: DocumentFilters): Promise<any[]> => {
  const query: any = { isActive: true };
  
  if (filters.employeeId) {
    query.employeeId = new Types.ObjectId(filters.employeeId);
  }
  if (filters.category) {
    query.category = filters.category;
  }
  
  return await DocumentModel.find(query)
    .populate('employeeId', 'name email')
    .populate('uploadedBy', 'name email')
    .sort({ createdAt: -1 });
};

export const updateDocument = async (id: string, updateData: any): Promise<any> => {
  return await DocumentModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

export const deleteDocument = async (id: string): Promise<any> => {
  return await DocumentModel.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    { new: true }
  );
};

export const getExpiringDocuments = async (daysThreshold: number = 30): Promise<any[]> => {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
  
  return await DocumentModel.find({
    expiryDate: { $lte: thresholdDate, $gte: new Date() },
    isActive: true
  })
    .populate('employeeId', 'name email');
};

export const getDocumentStats = async (): Promise<any> => {
  const stats = await DocumentModel.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalSize: { $sum: '$fileSize' }
      }
    }
  ]);
  
  const totalDocs = await DocumentModel.countDocuments({ isActive: true });
  const totalSize = await DocumentModel.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, total: { $sum: '$fileSize' } } }
  ]);
  
  return {
    byCategory: stats,
    totalDocuments: totalDocs,
    totalStorage: totalSize[0]?.total || 0
  };
};