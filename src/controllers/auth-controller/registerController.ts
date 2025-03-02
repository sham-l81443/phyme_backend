import { AppError } from "@/errors/AppError";
import { ErrorCode } from "@/errors/errorCodes";
import { ErrorMessages } from "@/errors/errorMessages";
import prisma from "@/lib/prisma";
import OTPService from "@/services/OTPService";
import { registerSchema } from "@/validators/authSchema";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Response, Request } from "express";
import CreateResponse from "@/utils/responseCreator";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const validatedData = registerSchema.parse(req.body);  // Validate request body

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
                    phone: validatedData.phone,
                    name: validatedData.name,
                    registrationType: validatedData.registrationType
                },
            });

            const otp = await tx.oTP.create({
                data: {
                    expiry: new Date(new Date().getTime() + 5 * 60 * 1000),
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

            res.cookie("userId", transaction.user.id, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 15 * 60 * 1000,
                path: '/',
            })


            const data = {
                email: transaction.user.email,
                phoneNumber: transaction.user.phone,
                name: transaction.user.name
            }
            const responseData = CreateResponse({ data: data, message: 'User registered successfully' })

            res.status(200).json(responseData)  // send success response

        }

    } catch (error) {
        next(error)
    }


}