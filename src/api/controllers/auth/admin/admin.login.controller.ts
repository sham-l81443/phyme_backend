import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/core/utils/errors/AppError';
import prisma from '@/core/lib/prisma';
import { IController } from '@/core/types';
import { generateAdminAccessToken } from '@/core/utils/jwt/generate';
import { generateRefreshToken } from '@/core/utils/jwt/generateRefreshToken';
import createSuccessResponse from '@/core/utils/responseCreator';
import { loginSchema } from '@/core/schema/authSchema';
import { UserRole } from '@/core/constants/ENUMS/user';
import { setAccessTokenCookie, setRefreshTokenCookie } from '@/core/utils/cookies';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { logger } from '@/core/utils/logger';
import { ADMIN_CONFIG } from '@/core/config/auth';


/**
 * Handles admin login, validates credentials, generates JWT tokens, and sets cookies.
 * @param req - Express request with email and password in body
 * @param res - Express response
 * @param next - Express next function for error handling
 * @returns JSON response with success message and admin data
 */
const adminLoginController: IController = async (req, res, next) => {

    const data = await bcrypt.hash('Sudoski101@',10)
    console.log('=================',data,'========================')
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
            console.log('admin password',admin)
            console.log('validated password',validatedData.password)
    
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
                expiresIn: ADMIN_CONFIG.accessTokenExpiry, // Access token expiry in seconds
            },
        });

        return res.status(200).json(resObj);
    } catch (e) {
        next(e);
    }
};

export default adminLoginController;