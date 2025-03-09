import { AppError } from "@/errors/AppError";

import prisma from "@/lib/prisma";
import { verifySchema } from "@/validators/authSchema";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import createSuccessResponse from "@/utils/responseCreator";
import { generateJwt } from "@/utils/generateJwt";
import { generateRefreshToken } from "@/utils/generateRefreshToken";


export const verifyUser = async (req: Request, res: Response, next: Function) => {
    try {

        console.log('All Cookies:', req.cookies);

        // Get user ID from cookie
        const userId = req.cookies.userId;

        if (!userId) {
            res.clearCookie('userId');
            throw new AppError({ errorType: "Unauthorized", message: "User does not exist" });
        }

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
            data: { otp: await bcrypt.hash(otpData.otp, 5), isUsed: true }
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
                userType: true
            }
        });


        const refreshToken = await generateRefreshToken(userId,'USER')

        const token = generateJwt({ email: updatedUser.email, userId: userId, role: updatedUser.userType })
        console.log(token, 'jwt token fron util fucntion')



        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        })


        res.cookie("userId", userId, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 60 * 60 * 1000,
            path: '/',
        })



        // Set JWT token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 120 * 60 * 1000,
            path: "/"
        });

        const resObj = createSuccessResponse({
            data: updatedUser,
            message: "User verified successfully"
        });

        res.status(201).json(resObj);

    } catch (error) {
        next(error);  // Pass error to Express error handler
    }
};



