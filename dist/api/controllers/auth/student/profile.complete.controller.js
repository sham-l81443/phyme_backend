"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const authSchema_1 = require("@/core/schema/authSchema");
const AppError_1 = require("@/core/utils/errors/AppError");
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const uuid_1 = require("uuid");
const sendMail_1 = require("@/core/utils/sendMail");
const profileCompleteController = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new AppError_1.AppError({
                errorType: 'Unauthorized',
                message: 'Unauthorized'
            });
        }
        const validatedData = authSchema_1.profileSchema.safeParse(req.body);
        if (!validatedData.success) {
            throw new AppError_1.AppError({
                errorType: 'Bad Request',
                message: 'Please provide valid data',
                data: validatedData.error,
            });
        }
        const { fullName, syllabusId, classId, parentEmail, isUnderAged } = validatedData.data;
        const result = await prisma_1.default.$transaction(async (tx) => {
            const syllabus = await tx.syllabus.findUnique({
                where: { id: Number(syllabusId) },
            });
            if (!syllabus) {
                throw new AppError_1.AppError({
                    errorType: 'Bad Request',
                    message: 'Syllabus does not exist',
                });
            }
            const classRecord = await tx.class.findUnique({
                where: { id: Number(classId) },
            });
            if (!classRecord) {
                throw new AppError_1.AppError({
                    errorType: 'Bad Request',
                    message: 'Class does not exist',
                });
            }
            const updatedUser = await tx.user.update({
                where: { id: user.id },
                data: {
                    name: fullName,
                    syllabusId: Number(syllabusId),
                    classId: Number(classId),
                    parentEmail,
                    isUnderAged,
                    isProfileComplete: true
                },
                select: {
                    id: true,
                    name: true,
                    syllabusId: true,
                    classId: true,
                    parentEmail: true,
                    isUnderAged: true,
                    parent_email: true,
                },
            });
            if (isUnderAged && parentEmail) {
                const token = (0, uuid_1.v4)();
                const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
                return { updatedUser, token, parentEmail };
            }
            return { updatedUser };
        }, {
            timeout: 10000
        });
        if (result.token && result.parentEmail) {
            const consentLink = `${process.env.APP_URL}/parent-consent?token=${result.token}`;
            try {
                await (0, sendMail_1.sendEmail)({
                    to: result.parentEmail,
                    subject: 'Parental Consent Required',
                    html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f5f7fa;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .header h1 {
                color: #2c3e50;
                margin: 0;
                font-size: 24px;
              }
              .content {
                margin-bottom: 30px;
              }
              .content p {
                margin-bottom: 15px;
                font-size: 16px;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #3498db;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
              }
              .button:hover {
                background-color: #2980b9;
              }
              .footer {
                text-align: center;
                color: #666;
                font-size: 14px;
                margin-top: 30px;
                border-top: 1px solid #eee;
                padding-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Parental Consent Required</h1>
              </div>
              <div class="content">
                <p>Dear Parent/Guardian,</p>
                <p>Your child has registered for our platform. We need your consent to proceed with their registration.</p>
                <p>Please click the button below to provide your consent:</p>
                <a href="${consentLink}" class="button">Provide Consent</a>
                <p>This link will expire in 24 hours.</p>
              </div>
              <div class="footer">
                <p>Thank you for your cooperation.</p>
                <p>The Quiz Team</p>
              </div>
            </div>
          </body>
          </html>
        `,
                });
            }
            catch (emailError) {
                console.error('Failed to send consent email:', emailError);
                const successObj = (0, responseCreator_1.default)({
                    data: Object.assign(Object.assign({}, result.updatedUser), { warnings: [
                            'Failed to send consent email. Please contact support if you need to resend the consent link.'
                        ] }),
                    code: 200,
                    message: "Profile updated successfully"
                });
                res.status(200).json(successObj);
                return;
            }
        }
        const successObj = (0, responseCreator_1.default)({
            data: result.updatedUser,
            code: 200,
            message: "Profile updated successfully"
        });
        res.status(200).json(successObj);
    }
    catch (e) {
        console.error("Error in profile.complete.controller.ts:", e);
        next(e);
    }
};
exports.default = profileCompleteController;
