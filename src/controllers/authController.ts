import { ZodError } from 'zod';
import { registerSchema } from '../validators/schema';
import { Request, Response } from 'express';
import handleZodError from '../utils/zodErrorHandler';
import prisma from '../lib/prisma'
import bcrypt from 'bcrypt'
import OTPService from '../services/OTPService'
import { createSuccessResponse } from '../utils/createResponse';
import { PrismaClient } from '@prisma/client';



export const registerUser = async (req: Request, res: Response) => {

    try {

        const validatedData = registerSchema.parse(req.body);  // Validate request body

        const isUser = await prisma.user.findUnique({
            where: { email: validatedData.email }    // check if user already exist with the give email or not
        })



        if (isUser) {
            res.status(400).json({ message: 'User with this email already exists' })  // if user already exist then return with error message
            return
        }


        const otpResponse = await OTPService.sendOTPEmail(validatedData.email) // send otp

        if (!otpResponse.success) {

            throw new Error("Failed to send OTP");
        }


        const transaction = await prisma.$transaction(async (tx:  Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => {


            const hashedPassword = await bcrypt.hash(validatedData.password, 8); // hash password


            const user = await tx.user.create({
                data: {
                    email: validatedData.email,
                    phoneNumber: validatedData.phoneNumber,
                    password: hashedPassword,
                },
            });

            const otp = await tx.oTP.create({
                data: {
                    expiry: new Date(),
                    otp: otpResponse.otp,
                    userId: user.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            })


            return { user, otp }


        })


        if (transaction) {

            const responseData = createSuccessResponse({ data: transaction.user, message: 'OTP sent successfully' })  // create success response

            res.status(200).json(responseData)  // send success response

        }

    } catch (error) {

        if (error instanceof ZodError) {

            const errorMsg = handleZodError(error);

            res.status(400).json({
                message: errorMsg,
            });

            return;
        }

        console.log(error)

        if (error instanceof Error) {
            res.status(400).json({ message: error.message || 'unknown error' })
        } else {
            res.status(400).json({ message: 'unknown error' })
        }

    };


}



