import { AppError } from "@/core/utils/errors/AppError";
import prisma from "@/core/lib/prisma";
import OTPService from "@/core/services/OTPService";
import { Prisma, PrismaClient } from "@prisma/client";
import { NextFunction, Response, Request } from "express";
import CreateResponse from "@/core/utils/responseCreator";
import { signupSchema } from "@/core/lib/validitions/authSchema";
import { STUDENT_CONFIG } from "@/core/config/auth";
import { logger } from "@/core/utils/logger";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const validatedData = signupSchema.parse(req.body);  // Validate request body

        const user = await prisma.user.findUnique({
            where: { email: validatedData.email }    // check if user already exist with the give email or not
        })

        // handle if user with email alreday exist

        if (user) {

            throw new AppError({ errorType: 'Bad Request', message: 'User with this email already exist' })
        }

        // send otp

        const otpResponse = await OTPService.sendOTPEmail(validatedData.email)

        // handle if sending otp failed
        if (!otpResponse.success) {

            throw new AppError({ errorType: 'Internal Server Error', message: 'Failed to send OTP' })

        }


        const transaction = await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => {

            const user = await tx.user.create({
                data: {
                    email: validatedData.email,
                    registrationType: validatedData.registrationType,
                    name: ''
                },
            });

            const otp = await tx.oTP.create({
                data: {
                    expiry: new Date(new Date().getTime() + 10 * 60 * 1000),
                    otp: otpResponse.otp,
                    userId: user.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            })


            return { user, otp }


        })

        if (!transaction) {
            throw new AppError({ errorType: 'Internal Server Error', message: 'Failed to create user' })
        }

        if (transaction) {

            res.cookie(STUDENT_CONFIG.STUDENT_USER_ID_TOKEN_KEY, transaction.user.id, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: STUDENT_CONFIG.userTokenExpiry,
                path: '/',
            })


            const data = { email: transaction.user.email }

            const responseData = CreateResponse({ data: data, message: 'User registered successfully' })

            console.log(responseData)

            res.status(201).json(responseData)  // send success response

        }

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {

            logger.error("Database error", { error: error.message });

            return next(new AppError({ errorType: "Internal Server Error", message: "Database unavailable" }));

        }

        logger.error("Google login error", { error: error instanceof Error ? error.message : String(error) });
        next(error);
    }


}