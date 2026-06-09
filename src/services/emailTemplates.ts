// Template for Leave Request to Admin
export const leaveRequestTemplate = (employeeName: string, leaveData: any) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #4f46e5; padding: 20px; text-align: center; }
        .header h1 { color: white; margin: 0; }
        .content { padding: 20px; border: 1px solid #e5e7eb; }
        .info-box { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .button { background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Leave Request</h1>
        </div>
        <div class="content">
          <p>Dear Admin,</p>
          <p><strong>${employeeName}</strong> has submitted a leave request.</p>
          <div class="info-box">
            <p><strong>Leave Type:</strong> ${leaveData.type}</p>
            <p><strong>Start Date:</strong> ${new Date(leaveData.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> ${new Date(leaveData.endDate).toLocaleDateString()}</p>
            <p><strong>Reason:</strong> ${leaveData.reason}</p>
          </div>
          <p>Please review and take action.</p>
          <a href="${process.env.FRONTEND_URL}/leave/requests" class="button">View Request</a>
        </div>
        <div class="footer">
          <p>This is an automated message from EMS System.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template for Leave Status Update to Employee
export const leaveStatusTemplate = (employeeName: string, status: string, comments?: string) => {
  const color = status === 'approved' ? '#10b981' : '#ef4444';
  const statusText = status === 'approved' ? 'Approved' : 'Rejected';
  const message = status === 'approved' ? 'has been approved' : 'has been rejected';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: ${color}; padding: 20px; text-align: center; }
        .header h1 { color: white; margin: 0; }
        .content { padding: 20px; border: 1px solid #e5e7eb; }
        .button { background-color: ${color}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Leave Request ${statusText}</h1>
        </div>
        <div class="content">
          <p>Dear ${employeeName},</p>
          <p>Your leave request ${message}.</p>
          ${comments ? `<div class="info-box"><p><strong>Admin Comments:</strong> ${comments}</p></div>` : ''}
          <a href="${process.env.FRONTEND_URL}/leave/my-leaves" class="button">View Status</a>
        </div>
        <div class="footer">
          <p>This is an automated message from EMS System.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template for Attendance Reminder
export const attendanceReminderTemplate = (employeeName: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #f59e0b; padding: 20px; text-align: center; }
        .header h1 { color: white; margin: 0; }
        .content { padding: 20px; border: 1px solid #e5e7eb; }
        .button { background-color: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Attendance Reminder</h1>
        </div>
        <div class="content">
          <p>Dear ${employeeName},</p>
          <p>You haven't checked in yet today. Please remember to mark your attendance.</p>
          <a href="${process.env.FRONTEND_URL}/attendance/my-attendance" class="button">Mark Attendance</a>
        </div>
        <div class="footer">
          <p>This is an automated reminder from EMS System.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template for Payroll Processed
export const payrollProcessedTemplate = (employeeName: string, amount: number, month: number, year: number) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #10b981; padding: 20px; text-align: center; }
        .header h1 { color: white; margin: 0; }
        .content { padding: 20px; border: 1px solid #e5e7eb; }
        .amount { font-size: 28px; font-weight: bold; color: #10b981; text-align: center; margin: 20px 0; }
        .button { background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payroll Processed</h1>
        </div>
        <div class="content">
          <p>Dear ${employeeName},</p>
          <p>Your salary for ${months[month - 1]} ${year} has been processed.</p>
          <div class="amount">₹${amount.toLocaleString()}</div>
          <a href="${process.env.FRONTEND_URL}/payroll/my-payroll" class="button">View Payslip</a>
        </div>
        <div class="footer">
          <p>This is an automated message from EMS System.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template for Shift Assignment
export const shiftAssignmentTemplate = (employeeName: string, shiftData: any) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #4f46e5; padding: 20px; text-align: center; }
        .header h1 { color: white; margin: 0; }
        .content { padding: 20px; border: 1px solid #e5e7eb; }
        .info-box { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .button { background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Shift Assigned</h1>
        </div>
        <div class="content">
          <p>Dear ${employeeName},</p>
          <p>A new shift has been assigned to you.</p>
          <div class="info-box">
            <p><strong>Shift:</strong> ${shiftData.title}</p>
            <p><strong>Date:</strong> ${new Date(shiftData.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${shiftData.startTime} - ${shiftData.endTime}</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/shifts/my-shifts" class="button">View Shift</a>
        </div>
        <div class="footer">
          <p>This is an automated message from EMS System.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};