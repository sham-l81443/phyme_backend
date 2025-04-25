import prisma from "@/lib/prisma";
import { profileSchema } from "@/schema/authSchema";
import { IController } from "@/types";
import { AppError } from "@/utils/errors/AppError";
import createSuccessResponse from "@/utils/responseCreator";
import { IStudentAccessToken } from "@/schema";
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from "@/utils/sendMail";

const profileCompleteController: IController = async (req, res, next) => {
  try {
    const user = req.user as IStudentAccessToken 

    if (!user) {
      throw new AppError({
        errorType: 'Unauthorized',
        message: 'Unauthorized'
      });
    }

    const validatedData = profileSchema.safeParse(req.body)

    if (!validatedData.success) {
      throw new AppError({
        errorType: 'Bad Request',
        message: 'Please provide valid data',
        data: validatedData.error,
      });
    }

    const { fullName, syllabusId, classId, parentEmail, isUnderAged } = validatedData.data


    const result = await prisma.$transaction( async (tx) => {
        // Validate syllabusId and classId exist
        const syllabus = await tx.syllabus.findUnique({
          where: { id: Number(syllabusId) },
        });
        if (!syllabus) {
          throw new AppError({
            errorType: 'Bad Request',
            message: 'Syllabus does not exist',
          });
        }
  
        const classRecord = await tx.class.findUnique({
          where: { id: Number(classId) },
        });
        if (!classRecord) {
          throw new AppError({
            errorType: 'Bad Request',
            message: 'Class does not exist',
          });
        }
  
        // Update user
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            name:fullName,
            syllabusId: Number(syllabusId),
            classId: Number(classId),
            parentEmail,
            isUnderAged,
            isProfileComplete:true
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

        // If underaged, generate consent token
        if (isUnderAged && parentEmail) {
          const token = uuidv4();
          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry

        //   await tx.parentConsentToken.create({
        //     data: {
        //       token,
        //       userId: user.id,
        //       expiresAt,
        //     },
        //   });

          return { updatedUser, token, parentEmail };
        }
        return { updatedUser };
    }, {
      timeout: 10000 // Increase timeout to 10 seconds
    });

    // Send email after transaction is complete
    if (result.token && result.parentEmail) {
      const consentLink = `${process.env.APP_URL}/parent-consent?token=${result.token}`;
      try {
        await sendEmail({
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
      } catch (emailError) {
        console.error('Failed to send consent email:', emailError);
        // Add a warning message to the response
        const successObj = createSuccessResponse({
          data: {
            ...result.updatedUser,
            warnings: [
              'Failed to send consent email. Please contact support if you need to resend the consent link.'
            ]
          },
          code: 200,
          message: "Profile updated successfully"
        });
        res.status(200).json(successObj);
        return;
      }
    }

    const successObj = createSuccessResponse({
      data: result.updatedUser,
      code: 200,
      message: "Profile updated successfully"
    });

    res.status(200).json(successObj);
  } catch (e) {
    console.error("Error in profile.complete.controller.ts:", e);
    next(e);
  }
};

export default profileCompleteController;