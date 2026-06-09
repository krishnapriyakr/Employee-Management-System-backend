import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test email connection
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready to send messages');
    return true;
  } catch (error) {
    console.error(' Email service error:', error);
    console.log(' Please check your EMAIL_USER and EMAIL_PASS in .env file');
    return false;
  }
};

// Main function to send email
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"EMS System" <${process.env.EMAIL_FROM || 'noreply@ems.com'}>`,
      to: to,
      subject: subject,
      html: html,
    });
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Email error:', error.message);
    return { success: false, error: error.message };
  }
};

export default transporter;