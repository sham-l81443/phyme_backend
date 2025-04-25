import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/errors/AppError';
import prisma from '@/lib/prisma';
import { IController } from '@/types';
import { generateAdminAccessToken } from '@/utils/jwt/generate';
import { generateRefreshToken } from '@/utils/jwt/generateRefreshToken';
import createSuccessResponse from '@/utils/responseCreator';
import { loginSchema } from '@/schema/authSchema';
import { UserRole } from '@/constants/enums/user';
import { setAccessTokenCookie, setRefreshTokenCookie } from '@/utils/cookies/setRefreshCookie';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';


/**
 * Handles admin login, validates credentials, generates JWT tokens, and sets cookies.
 * @param req - Express request with email and password in body
 * @param res - Express response
 * @param next - Express next function for error handling
 * @returns JSON response with success message and admin data
 */
const adminLoginController: IController = async (req, res, next) => {


    try {
        const validatedData = loginSchema.parse(req.body);
        logger.info('Admin login attempt', { email: validatedData.email });

        let admin;
        try {
            admin = await prisma.admin.findUnique({
                where: {
                    email: validatedData.email,
                    isVerified: true,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new AppError({ errorType: 'Internal Server Error', message: 'Database query failed' });
            }
            throw error;
        }

        if (!admin) {
            throw new AppError({ errorType: 'Unauthorized', message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(validatedData.password, admin.password);
        if (!isPasswordValid) {
            throw new AppError({ errorType: 'Unauthorized', message: 'Invalid email or password' });
        }

        const token = generateAdminAccessToken({ id: admin.id, role: UserRole.ADMIN, email: admin.email });
        const refreshToken = await generateRefreshToken(admin.id, UserRole.ADMIN);

        if (!refreshToken) {
            throw new AppError({ errorType: 'Internal Server Error', message: 'Failed to generate refresh token' });
        }

        setRefreshTokenCookie({
            res,
            cookieValue: refreshToken.plainToken,
            usageType: UserRole.ADMIN,
        });

        setAccessTokenCookie({
            res,
            cookieValue: token,
            usageType: UserRole.ADMIN,
        });

        const resObj = createSuccessResponse({
            message: 'Logged in successfully',
            data: {
                isAdmin: true,
                email: admin.email,
                expiresIn: 15 * 60, // Access token expiry in seconds
            },
        });

        return res.status(200).json(resObj);
    } catch (e) {
        next(e);
    }
};

export default adminLoginController;