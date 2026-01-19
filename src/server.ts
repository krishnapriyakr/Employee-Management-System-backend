import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Routes
import authRoutes from './modules/auth/authRoutes';
import employeesRoutes from './modules/employees/employeesRoutes';

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeesRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Employee Management System API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});



// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV}`);
 
});