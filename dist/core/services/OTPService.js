"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = require("crypto");
const auth_1 = require("@/core/config/auth");
class OTPService {
    static getTemplate(otp) {
        return `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your One-Time Password</h2>
            <p>Your OTP is valid for only ${auth_1.COMMON_CONFIG.OTP_EXPIRY_MINUTES} minutes:</p>
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
    static generateOTP() {
        return String((0, crypto_1.randomInt)(100000, 999999));
    }
    static createTransporter() {
        return nodemailer_1.default.createTransport({
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
        });
    }
    static async sendOTPEmail(email) {
        console.log(email, 'email');
        try {
            const otp = this.generateOTP();
            const transporter = this.createTransporter();
            const mailOptions = {
                from: process.env.SMTP_FROM,
                to: email,
                subject: 'Your One-Time Password (OTP)',
                html: this.getTemplate(otp),
            };
            await transporter.sendMail(mailOptions);
            return { otp, success: true };
        }
        catch (error) {
            console.error('Error sending OTP email:', error);
            return { otp: '', success: false };
        }
    }
    static verifyOTP(userProvidedOTP, storedOTP) {
        return userProvidedOTP === storedOTP;
    }
}
exports.default = OTPService;
