import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import { AuthRequest } from '../../middleware/auth';
import * as documentsService from './documentsService';

const UPLOAD_DIR = path.join(__dirname, '../../../uploads');

// Upload document (Admin only)
export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const { employeeId, title, description, category, expiryDate } = req.body;
    const file = req.file;

    if (!employeeId || !title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const result = await documentsService.uploadDocument(
      req.user.userId,
      file!,
      { employeeId, title, description, category, expiryDate: expiryDate ? new Date(expiryDate) : undefined }
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error uploading document',
      error: error.message
    });
  }
};

// Get my documents (Employee)
export const getMyDocuments = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const result = await documentsService.getMyDocuments(req.user.userId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching documents',
      error: error.message
    });
  }
};

// Get employee documents (Admin)
export const getEmployeeDocuments = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const { employeeId } = req.params;
    const result = await documentsService.getEmployeeDocuments(employeeId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching documents',
      error: error.message
    });
  }
};

// Get all documents (Admin)
export const getAllDocuments = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const { employeeId, category } = req.query;
    const result = await documentsService.getAllDocuments({ employeeId, category });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching documents',
      error: error.message
    });
  }
};

// Download document
export const downloadDocument = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { id } = req.params;
    const result = await documentsService.getDocumentById(id);

    if (!result.success || !result.data) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const document = result.data;
    const filePath = path.join(UPLOAD_DIR, path.basename(document.fileUrl));

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.download(filePath, document.fileName);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error downloading document',
      error: error.message
    });
  }
};

// Delete document (Admin only)
export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const { id } = req.params;
    const result = await documentsService.deleteDocument(id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting document',
      error: error.message
    });
  }
};

// Get document stats (Admin)
export const getDocumentStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user?.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Admin only.'
      });
    }

    const result = await documentsService.getDocumentStats();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
};