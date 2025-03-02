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









