import cron from 'node-cron';
import UserModel from '../models/UserModel';
import AttendanceModel from '../models/Attendance';
import { sendAttendanceReminder } from '../services/emailService';

// This function runs every day at 10:00 AM
export const startAttendanceReminderJob = () => {
  cron.schedule('0 10 * * *', async () => {
    console.log(' Running attendance reminder job at 10:00 AM...');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get all employees
    const employees = await UserModel.find({ role: 'employee' });
    let reminderCount = 0;
    
    for (const employee of employees) {
      // Check if employee already marked attendance today
      const existingAttendance = await AttendanceModel.findOne({
        employeeId: employee._id,
        date: { $gte: today }
      });
      
      // If not marked, send reminder
      if (!existingAttendance) {
        await sendAttendanceReminder(employee._id.toString());
        reminderCount++;
      }
    }
    
    console.log(` Attendance reminders sent to ${reminderCount} employee(s)`);
  });
  
  console.log(' Attendance reminder job scheduled for 10:00 AM daily');
};