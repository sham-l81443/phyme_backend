import { ZodError } from 'zod';
import { registerSchema } from '../validators/authSchema';
import { Request, Response } from 'express';
import handleZodError from '../utils/zodErrorHandler';
import prisma from '../lib/prisma'
import bcrypt from 'bcrypt'
import OTPService from '../services/OTPService'
import { createSuccessResponse } from '../utils/createResponse';
import { PrismaClient } from '@prisma/client';
import googleConfig from '@/config/googleConfig';
import passport from 'passport';



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


        const transaction = await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => {

            const user = await tx.user.create({
                data: {
                    email: validatedData.email,
                    phone: validatedData.phone,
                    name: validatedData.name,
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


        if (transaction) {

            const data = {
                email: transaction.user.email,
                phoneNumber: transaction.user.phone,
                name: transaction.user.name
            }
            const responseData = createSuccessResponse({ data: data, message: 'OTP sent successfully' })  // create success response

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


/**
 * Initiates Google authentication using Passport.js.
 * Redirects the user to Google's OAuth 2.0 consent page for login.
 * The scope includes access to the user's email and profile information.
 */
export const authLogin = () => {
     passport.authenticate('google', { scope: ['email', 'profile'] })
}


/**
 * Handles the callback from Google's OAuth 2.0 flow.
 * Redirects to '/login' if the authentication fails.
 * Redirects to 'http://localhost:3000/login' if the authentication succeeds.
 */
export const authCallback = () => {

    passport.authenticate('google', {

        failureRedirect: '/login',

        session: false

    }),
        (_req: Request, res: Response) => {

            res.redirect('http://localhost:3000/login');
        }
}