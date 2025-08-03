
import nodemailer from 'nodemailer'
import { randomInt } from 'crypto';
import { COMMON_CONFIG } from '../config/auth';

class OTPService {


  static getTemplate(otp: string) {
    return `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your One-Time Password</h2>
            <p>Your OTP is valid for only ${COMMON_CONFIG.OTP_EXPIRY_MINUTES} minutes:</p>
            <div style="background-color: #f4f4f4; 
                        padding: 20px; 
                        font-size: 24px; 
                        text-align: center; 
                        letter-spacing: 10px;">
              <strong>${otp}</strong>
            </div>
            <p>Do not share this OTP with anyone.</p>
            <small>If you did not request this, please ignore this email.</small>
          </div>
        `;
  }

  static generateOTP(): string {
    return String(randomInt(100000, 999999)); // Always 6-digit number
  }
  static createTransporter() {

    return nodemailer.createTransport({
      service: 'gmail',
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },

      debug: true,
      logger: true
    })
  }

  static async sendOTPEmail(email: string): Promise<{ otp: string, success: boolean }> {
    console.log(email,'email')
    try {
      // Generate OTP
      const otp = this.generateOTP();

      // Create transporter
      const transporter = this.createTransporter();

      // Email configuration
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Your One-Time Password (OTP)',
        html: this.getTemplate(otp),
      };

      // Send email
      await transporter.sendMail(mailOptions);

      return { otp, success: true };
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return { otp: '', success: false };
    }
  }

  // Verify OTP (typically stored in a database or cache)
  static verifyOTP(userProvidedOTP: string, storedOTP: string): boolean {

    return userProvidedOTP === storedOTP;
  }

}

export default OTPService;