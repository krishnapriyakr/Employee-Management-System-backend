import fs from 'fs';
import path from 'path';
import * as documentsRepository from './documentsRepository';
import { CreateDocumentDTO } from './documents.types';

const UPLOAD_DIR = path.join(__dirname, '../../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Generate unique filename
const generateFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const extension = path.extname(originalName);
  return `${timestamp}_${random}${extension}`;
};

// Get category label
export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    id_proof: 'ID Proof',
    offer_letter: 'Offer Letter',
    contract: 'Contract',
    performance: 'Performance Review',
    educational: 'Educational Certificate',
    medical: 'Medical Record',
    other: 'Other'
  };
  return labels[category] || category;
};

// ========== Service Functions ==========

// Upload document
export const uploadDocument = async (
  adminId: string,
  file: Express.Multer.File,
  documentData: Omit<CreateDocumentDTO, 'fileName' | 'fileUrl' | 'fileSize' | 'fileType'>
) => {
  try {
    if (!file) {
      return {
        success: false,
        message: 'No file uploaded'
      };
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return {
        success: false,
        message: 'File size cannot exceed 10MB'
      };
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.mimetype)) {
      return {
        success: false,
        message: 'Invalid file type. Allowed: PDF, JPEG, PNG, DOC, DOCX'
      };
    }

    const fileName = generateFileName(file.originalname);
    const filePath = path.join(UPLOAD_DIR, fileName);
    
    // Save file
    fs.writeFileSync(filePath, file.buffer);
    
    const fileUrl = `/uploads/${fileName}`;
    
    const document = await documentsRepository.createDocument({
      ...documentData,
      fileName: file.originalname,
      fileUrl,
      fileSize: file.size,
      fileType: file.mimetype,
      uploadedBy: adminId
    });
    
    return {
      success: true,
      message: 'Document uploaded successfully',
      data: document
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error uploading document',
      error: error.message
    };
  }
};

// Get employee documents
export const getEmployeeDocuments = async (employeeId: string) => {
  try {
    const documents = await documentsRepository.findDocumentsByEmployee(employeeId);
    
    // Add category labels
    const docsWithLabels = documents.map((doc: any) => ({
      ...doc.toObject(),
      categoryLabel: getCategoryLabel(doc.category)
    }));
    
    return {
      success: true,
      data: docsWithLabels
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching documents',
      error: error.message
    };
  }
};

// Get my documents (for employee)
export const getMyDocuments = async (employeeId: string) => {
  return await getEmployeeDocuments(employeeId);
};

// Get all documents (Admin)
export const getAllDocuments = async (filters: any) => {
  try {
    const documents = await documentsRepository.findAllDocuments(filters);
    
    const docsWithLabels = documents.map((doc: any) => ({
      ...doc.toObject(),
      categoryLabel: getCategoryLabel(doc.category)
    }));
    
    return {
      success: true,
      data: docsWithLabels
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching documents',
      error: error.message
    };
  }
};

// Get document by ID
export const getDocumentById = async (documentId: string) => {
  try {
    const document = await documentsRepository.findDocumentById(documentId);
    
    if (!document) {
      return {
        success: false,
        message: 'Document not found'
      };
    }
    
    return {
      success: true,
      data: {
        ...document.toObject(),
        categoryLabel: getCategoryLabel(document.category)
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching document',
      error: error.message
    };
  }
};

// Delete document
export const deleteDocument = async (documentId: string) => {
  try {
    const document = await documentsRepository.findDocumentById(documentId);
    
    if (!document) {
      return {
        success: false,
        message: 'Document not found'
      };
    }
    
    // Delete physical file
    const filePath = path.join(UPLOAD_DIR, path.basename(document.fileUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await documentsRepository.deleteDocument(documentId);
    
    return {
      success: true,
      message: 'Document deleted successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error deleting document',
      error: error.message
    };
  }
};

// Get document stats (Admin)
export const getDocumentStats = async () => {
  try {
    const stats = await documentsRepository.getDocumentStats();
    const expiringDocs = await documentsRepository.getExpiringDocuments(30);
    
    return {
      success: true,
      data: {
        ...stats,
        expiringDocuments: expiringDocs.map((doc: any) => ({
          id: doc._id,
          title: doc.title,
          employeeName: doc.employeeId?.name,
          expiryDate: doc.expiryDate
        }))
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error fetching stats',
      error: error.message
    };
  }
};