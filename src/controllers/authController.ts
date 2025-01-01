import { loginSchema, registerSchema, verifySchema } from '../validators/authSchema';
import { NextFunction, Request, Response } from 'express';
import prisma from '../lib/prisma'
import bcrypt from 'bcrypt'
import OTPService from '../services/OTPService'
import { createSuccessResponse } from '../utils/createResponse';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import jwt from "jsonwebtoken"
import { AppError } from '../errors/AppError';
import { ErrorCode } from '../errors/errorCodes';
import { ErrorMessages } from '../errors/errorMessages';
import { statusCode } from '../errors/statusCode';


export const registerUser = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const validatedData = registerSchema.parse(req.body);  // Validate request body

        const user = await prisma.user.findUnique({
            where: { email: validatedData.email }    // check if user already exist with the give email or not
        })

        // handle if user with email alreday exist

        if (user) {
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



export const verifyUser = async (req: Request, res: Response) => {


    console.log('All Cookies:', req.cookies);

    // validate data
    const validatedData = verifySchema.parse(req.body)


    // get user id from cookie

    const userId = req.cookies.userId

    if (!userId) {
        throw new AppError(ErrorMessages.UNAUTHORIZED, statusCode.UNAUTHORIZED, ErrorCode.UNAUTHORIZED, { data: null })
    }

    // check if otp exist in table expery,userId

    const otpData = await prisma.oTP.findFirst({
        where: {
            userId: userId,
            otp: validatedData.otp,
            isUsed: false,
            expiry: {
                gte: new Date()
            }
        }
    })

    // handle if no otp found
    if (!otpData) {


        throw new AppError(ErrorMessages.OTP_VERIFICATION_FAILED, statusCode.OTP_VERIFICATION_FAILED, ErrorCode.OTP_VERIFICATION_FAILED, { data: { otp: validatedData.otp } })

    }

    // if otp update otp table 
    if (otpData) {


        await prisma.oTP.update(
            {
                where: {
                    id: otpData.id
                },
                data: {
                    otp: '',
                    isUsed: true,
                }
            }
        )


        // update user table 
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                password: validatedData.password,
                isVerified: true
            }
        })

        // create jwt token 
        const token = await jwt.sign({
            id: userId,
            email: updatedUser.email
        },

            "123",

            {
                expiresIn: '5h'
            },
            (err) => {
                if (err) {
                    throw new AppError('Token Generation failed', 400, ErrorCode.UNKNOWN_ERROR)
                }
            }

        )

        // set jwt token in cookie 
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        })

        res.status(201).json({ message: 'successful', data: { token, updatedUser } })

    }

    console.log(otpData)


}






