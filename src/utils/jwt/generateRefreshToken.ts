import crypto from 'crypto';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { rethrowAppError } from '../errors/rethrowError';
import { ADMIN_CONFIG, STUDENT_CONFIG } from '@/config/auth';
import { Prisma } from '@prisma/client';
import { UserRole } from '@/constants/enums/user';
import { AppError } from '../errors/AppError';



interface RefreshTokenData {
    tokenSecret: string;
    tokenId: string;
    expiresAt: Date;
    createdAt: Date;
    adminId?: string;
    userId?: string;
}

async function generateRefreshToken(id: string, usageType: UserRole): Promise<{ plainToken: string }> {
    try {
        // Validate inputs
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid userId');
        }
        if (![UserRole.ADMIN, UserRole.STUDENT].includes(usageType)) {
            throw new Error('Invalid usageType');
        }

        // Verify user exists
        const userExists = await (usageType === UserRole.ADMIN
            ? prisma.admin.findUnique({ where: { id: id } })
            : prisma.user.findUnique({ where: { id: id } })
        );
        if (!userExists) {
            throw new AppError({ errorType: 'Not Found', message: `No ${usageType.toLowerCase()} found with id ${id}` });
        }

        // Generate tokens
        const refreshToken = crypto.randomBytes(40).toString('hex');
        const tokenId = crypto.randomBytes(16).toString('hex');
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 8); // Reduced cost for performance, adjust as needed
        const plainToken = `${tokenId}.${refreshToken}`; // Simplified to opaque token

        // Set expiry based on role
        const refreshTokenExpiry = usageType === UserRole.ADMIN ? ADMIN_CONFIG.refreshTokenExpiry : STUDENT_CONFIG.refreshTokenExpiry;
        if (!Number.isInteger(refreshTokenExpiry) || refreshTokenExpiry <= 0) {
            throw new Error('Invalid refreshTokenExpiry configuration');
        }

        // Prepare data for Prisma
        const data: RefreshTokenData = {
            tokenSecret: hashedRefreshToken,
            tokenId,
            expiresAt: new Date(Date.now() + refreshTokenExpiry),
            createdAt: new Date(),
            ...(usageType === UserRole.ADMIN ? { adminId: id } : { userId: id }),
        };

        // Store refresh token
        await prisma.refreshToken.create({ data });

        return { plainToken };
    } catch (error) {
        // Enhanced error logging (pseudo-code, replace with your logging solution)
        console.error(`Failed to generate refresh token for user ${id} (${usageType}):`, error);

        // Handle specific Prisma errors
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw rethrowAppError(error, 'Unique constraint violation while generating refresh token');
        }

        rethrowAppError(error, 'Error generating refresh token');
    }
}

export { generateRefreshToken };