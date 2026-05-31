import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

// Middleware to check if user has required role
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Check if user exists in request (from auth middleware)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }

      // Check if user has required role
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. ${req.user.role} role does not have permission to access this resource`,
          requiredRoles: roles
        });
      }

      next();
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Authorization error',
        error: error.message
      });
    }
  };
};

// Check if user is admin (simplified version)
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required'
    });
  }

  next();
};

// Check if user is employee (simplified version)
export const isEmployee = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  if (req.user.role !== 'employee' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Employee role required'
    });
  }

  next();
};