import { AppError } from "@/errors/AppError";
import { IController } from "@/types";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { generateJwt } from "@/utils/generateJwt";
import { generateRefreshToken } from "@/utils/generateRefreshToken";
import { z } from "zod";
export const authenticateAdmin: IController = async (req, res, next) => {
    try {
        const accessToken = req.cookies.adminToken;

        // Case 1: Access token exists - verify it
        if (accessToken) {
            try {

                if (!process.env.JWT_SECRET) {
                    throw new AppError({
                        errorType: "Internal Server Error",
                        message: "JWT_SECRET is not configured",
                    });
                }

                const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string);

                // Validate token payload structure
                const parsed = tokenSchema.safeParse(decoded);
                if (!parsed.success) {
                    throw new AppError({
                        errorType: "Unauthorized",
                        message: "Invalid token payload format",
                    });
                }
                req.user = parsed.data as ITokenSchema;
                return next();
            } catch (err) {
                // Clear the invalid access token
                res.clearCookie('adminToken', { path: '/' });

                // Handle specific JWT errors with appropriate messages
                if (err instanceof jwt.TokenExpiredError) {
                    // Token expired but valid format - continue to refresh token flow
                    console.log("Access token expired, attempting refresh token recovery");
                } else if (err instanceof jwt.JsonWebTokenError) {
                    throw new AppError({
                        errorType: "Unauthorized",
                        message: "Invalid access token"
                    });
                } else if (err instanceof AppError) {
                    throw err; // Re-throw our own AppError
                } else {
                    throw new AppError({
                        errorType: "Unauthorized",
                        message: "Token verification failed",
                        data: err
                    });
                }
            }
        }

        // Case 2: No valid access token - try refresh token
        const refreshTokenCookie = req.cookies.adminRefreshToken;

        if (!refreshTokenCookie) {
            throw new AppError({
                errorType: "Unauthorized",
                message: "Authentication required"
            });
        }

        // Parse the refresh token
        const tokenParts = refreshTokenCookie.split('.');
        if (tokenParts.length !== 2 || !tokenParts[0] || !tokenParts[1]) {
            throw new AppError({
                errorType: "Unauthorized",
                message: "Invalid refresh token format",
            });
        }

        const [tokenId, userRefreshToken] = tokenParts;

        if (!tokenId || !userRefreshToken) {
            throw new AppError({
                errorType: "Unauthorized",
                message: "Malformed refresh token"
            });
        }

        // Use a transaction to prevent race conditions with refresh token
        const result = await prisma.$transaction(async (tx) => {
            // Find and validate the refresh token - lock it for update
            const refreshToken = await tx.refreshToken.findFirst({
                where: {
                    tokenId: tokenId,
                    isRevoked: false,
                    expiresAt: { gte: new Date() }
                },
                select: {
                    Admin: { select: { id: true, email: true } },
                    tokenSecret: true
                }
            });

            if (!refreshToken) {
                throw new AppError({
                    errorType: "Unauthorized",
                    message: "Refresh token expired or invalid"
                });
            }

            // Verify the refresh token secret
            const isRefreshTokenValid = await bcrypt.compare(
                userRefreshToken,
                refreshToken.tokenSecret
            );

            if (!isRefreshTokenValid) {
                throw new AppError({
                    errorType: "Unauthorized",
                    message: "Invalid refresh token credentials"
                });
            }

            const admin = refreshToken.Admin;

            if (!admin) {
                throw new AppError({
                    errorType: "Unauthorized",
                    message: "Admin account not found"
                });
            }

            // Revoke the used refresh token immediately (prevents reuse)
            await tx.refreshToken.update({
                where: { tokenId: tokenId },
                data: { isRevoked: true }
            });

            return admin;
        },
            { timeout: 5000 }
        );

        // After successful transaction, generate new tokens
        const admin = result;
        const newRefreshToken = await generateRefreshToken(admin.id, 'ADMIN');
        const newAccessToken = generateJwt({
            email: admin.email,
            role: 'admin',
            userId: admin.id
        });

        // Set the new refresh token cookie
        res.cookie("adminRefreshToken", newRefreshToken.plainToken, {
            httpOnly: true,
            sameSite: "strict",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
            secure: process.env.NODE_ENV === "production",
            path: "/"
        });

        // Set the new access token cookie
        res.cookie("adminToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 120 * 60 * 1000, // 2 hours
            path: "/"
        });

        // Set user in request and continue
        req.user = {
            userId: admin.id,
            email: admin.email,
            role: 'admin'
        } as ITokenSchema;

        next();
    } catch (error) {
        // Clear cookies on authentication failure for security
        if (error instanceof AppError && error.errorType === "Unauthorized") {
            res.clearCookie("adminToken", { path: "/" });
            res.clearCookie("adminRefreshToken", { path: "/" });
        }
        console.error('Admin auth failed:', error);
        return next(error);

    }
};


const tokenSchema = z.object({
    email: z.string().email(),
    role: z.literal("admin"),
    userId: z.string().uuid(), // Assuming userId is a UUID
});


export type ITokenSchema = z.infer<typeof tokenSchema>;