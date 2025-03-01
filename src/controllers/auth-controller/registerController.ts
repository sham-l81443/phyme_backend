import { AppError } from "@/errors/AppError";
import { ErrorCode } from "@/errors/errorCodes";
import { ErrorMessages } from "@/errors/errorMessages";
import prisma from "@/lib/prisma";
import OTPService from "@/services/OTPService";
import { createSuccessResponse } from "@/utils/createResponse";
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


            const errorObj = 

            throw new AppError(ErrorMessages.EMAIL_ALREADY_EXISTS, 400, ErrorCode.EMAIL_ALREADY_EXISTS, { data: { email: validatedData.email } })
        }

        // send otp

        const otpResponse = await OTPService.sendOTPEmail(validatedData.email)

        // handle if sending otp failed
        if (!otpResponse.success) {

            throw new AppError(ErrorMessages.OTP_SEND_FAILURE, 400, ErrorCode.OTP_SEND_FAILURE, { data: null })

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
                    expiry: new Date(new Date().getTime() + 15 * 60 * 1000),
                    otp: otpResponse.otp,
                    userId: user.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            })


            return { user, otp }


        })

        if (!transaction) {
            throw new AppError(ErrorMessages.DATABASE_ERROR, 400, ErrorCode.DATABASE_ERROR, { data: null })
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
            const responseData = createSuccessResponse({ data: transaction.otp, message: 'OTP sent successfully' })  // create success response

            res.status(200).json(responseData)  // send success response

        }

    } catch (error) {
        next(error)
    }


}