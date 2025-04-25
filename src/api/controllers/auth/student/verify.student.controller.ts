import { AppError } from "@/utils/errors/AppError";

import prisma from "@/lib/prisma";
import { verifySchema } from "@/schema/authSchema";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import createSuccessResponse from "@/utils/responseCreator";
import { generateStudentAccessToken } from "@/utils/jwt/generate";
import { generateRefreshToken } from "@/utils/jwt/generateRefreshToken";
import { UserRole } from "@/constants/enums/user";
import { STUDENT_CONFIG } from "@/config/auth";
import { setAccessTokenCookie, setRefreshTokenCookie } from "@/utils/cookies/setRefreshCookie";
import { Prisma } from "@prisma/client";
import { logger } from "@/utils/logger";


export const verifyStudent = async (req: Request, res: Response, next: Function) => {
    try {

        console.log('started verify user')
        // Get user ID from cookie
        const userId = req.cookies?.[STUDENT_CONFIG.STUDENT_USER_ID_TOKEN_KEY];

        console.log('reading user id from cookie', userId)


        if (!userId) {
            res.clearCookie(STUDENT_CONFIG.STUDENT_USER_ID_TOKEN_KEY);
            throw new AppError({ errorType: "Unauthorized", message: "User does not exist" });
        }


        console.log('verifiying request body', req.body)

        // Validate data
        const validatedData = verifySchema.parse(req.body);


        // Check if OTP exists and is valid
        const otpData = await prisma.oTP.findFirst({
            where: {
                userId: userId,
                isUsed: false,
                expiry: { gte: new Date() }
            }
        });


        if (!otpData || otpData.otp !== validatedData.otp) {
            throw new AppError({ errorType: "Unauthorized", message: "Please provide a valid OTP" });
        }

        // Update OTP table to mark OTP as used
        await prisma.oTP.update({
            where: { id: otpData.id },
            data: { isUsed: true },
        });


        // Encrypt password
        const encryptedPassword = await bcrypt.hash(validatedData.password, 10);

        // Update user table
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                password: encryptedPassword,
                isVerified: true
            },
            select: {
                name: true,
                email: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
                phone: true,
                registrationType: true,
                subscriptionType: true,
                class: true,
                id: true
            }
        });


        const refreshToken = await generateRefreshToken(userId, UserRole.STUDENT)

        const token = generateStudentAccessToken({ class: updatedUser.class?.name || '', email: updatedUser.email, id: updatedUser.id, role: 'STUDENT', subscriptionType: updatedUser.subscriptionType })

        console.log(token, 'jwt token fron util fucntion')



        setRefreshTokenCookie({ res, cookieValue: refreshToken.plainToken, usageType: UserRole.STUDENT })

        setAccessTokenCookie({ res, cookieValue: token, usageType: UserRole.STUDENT })


        const resObj = createSuccessResponse({
            data: updatedUser,
            message: "User verified successfully"
        });


        res.status(201).json(resObj);

    } catch (error) {

        if (error instanceof Prisma.PrismaClientKnownRequestError) {

            logger.error("Database error", { error: error.message });

            return next(new AppError({ errorType: "Internal Server Error", message: "Database unavailable" }));

        }

        logger.error("Google login error", { error: error instanceof Error ? error.message : String(error) });
        next(error);

    }
};



