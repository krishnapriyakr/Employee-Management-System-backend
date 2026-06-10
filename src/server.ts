import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Routes
import authRoutes from './modules/auth/authRoutes';
import employeesRoutes from './modules/employees/employeesRoutes';
import leaveRoutes from './modules/leave/leaveRoutes';
import attendanceRoutes from './modules/attendance/attendanceRoutes';
import performanceRoutes from './modules/performance/performanceRoutes';
import documentRoutes from './modules/documents/documentsRoutes';
import recruitmentRoutes from './modules/recruitment/recruitmentRoutes';
import shiftRoutes from './modules/shift/shiftRoutes';
import payrollRoutes from './modules/payroll/payrollRoutes';
import exportRoutes from './export/exportRoutes';

import path from 'path';
import { verifyEmailConnection } from './config/emailConfig';
import { startAttendanceReminderJob } from './jobs/attendanceReminderJob';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log(' MongoDB connected successfully'))
  .catch((error) => console.log(' MongoDB connection error:', error));

  // Verify email connection (don't block startup if email fails)
verifyEmailConnection().catch(console.error);

// Start attendance reminder cron job
startAttendanceReminderJob();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/performance', performanceRoutes);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/documents', documentRoutes);

app.use('/uploads/resumes', express.static(path.join(__dirname, '../uploads/resumes')));

app.use('/api/recruitment', recruitmentRoutes);

app.use('/api/shift', shiftRoutes);

app.use('/api/payroll', payrollRoutes);

app.use('/api/export', exportRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Employee Management System API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// TEST EMAIL ENDPOINT - Remove after testing
app.post('/api/test-email', async (req, res) => {
  const { sendEmail } = await import('./config/emailConfig');
  const result = await sendEmail(
    'YOUR_EMAIL@gmail.com',  // Change to your email
    'Test Email from EMS',
    '<h1>✅ Test Successful!</h1><p>Your email configuration is working!</p>'
  );
  res.json(result);
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV}`);
 
});