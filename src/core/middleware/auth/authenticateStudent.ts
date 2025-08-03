import { AppError } from "../../utils/errors/AppError";
import { IController } from "../../types";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import prisma from "../../lib/prisma";
import { generateStudentAccessToken } from "../../utils/jwt/generate";
import { generateRefreshToken } from "../../utils/jwt/generateRefreshToken";
import { IStudentAccessToken, StudentAccessTokenSchema } from "../../schema";
import { UserRole } from "../../constants/ENUMS/user";
import { STUDENT_CONFIG } from "../../config/auth";
import { setAccessTokenCookie, setLoggedInCookie, setRefreshTokenCookie } from "../../utils/cookies";



export const authenticateStudent: IController = async (req, res, next) => {

    try {
        const accessToken = req.cookies?.[STUDENT_CONFIG.STUDENT_ACCESS_TOKEN_KEY];

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
                const parsed = StudentAccessTokenSchema.safeParse(decoded);
                if (!parsed.success) {
                    throw new AppError({
                        errorType: "Unauthorized",
                        message: "Invalid token payload format",
                    });
                }


                req.user = parsed.data;

                return next();

            } catch (err) {
                // Clear the invalid access token
                res.clearCookie(STUDENT_CONFIG.STUDENT_ACCESS_TOKEN_KEY, { path: '/' });

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
        const refreshTokenCookie = req.cookies?.[STUDENT_CONFIG.STUDENT_REFRESH_TOKEN_KEY];

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
                    User: { select: { id: true, email: true, classId: true,syllabusId: true } },
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

            const student = refreshToken.User;

            if (!student) {
                throw new AppError({
                    errorType: "Unauthorized",
                    message: "Student account not found"
                });
            }

            // Revoke the used refresh token immediately (prevents reuse)
            await tx.refreshToken.update({
                where: { tokenId: tokenId },
                data: { isRevoked: true }
            });

            return student;
        },
            { timeout: 5000 }
        );

        // After successful transaction, generate new tokens
        const user = result;
        const newRefreshToken = await generateRefreshToken(user.id, UserRole.STUDENT);
        const newAccessToken = generateStudentAccessToken({
            email: user.email,
            role: UserRole.STUDENT,
            id: user.id,
            classId: user.classId || '',
            syllabusId: user.syllabusId || '',
        });

        setRefreshTokenCookie({ res, cookieValue: newRefreshToken.plainToken, usageType: UserRole.STUDENT })

        setAccessTokenCookie({ res, cookieValue: newAccessToken, usageType: UserRole.STUDENT })

        setLoggedInCookie({ res, cookieValue: 'true', usageType: UserRole.STUDENT })
        // Set user in request and continue
        req.user = {
            id: user.id,
            email: user.email,
            role: UserRole.STUDENT,
            classId: user.classId || 0,
            syllabusId: user.syllabusId || 0,
        } as IStudentAccessToken;

        next();

    } catch (error) {

        if (error instanceof AppError && error.errorType === "Unauthorized") {
            res.clearCookie(STUDENT_CONFIG.STUDENT_ACCESS_TOKEN_KEY, { path: "/" });
            res.clearCookie(STUDENT_CONFIG.STUDENT_REFRESH_TOKEN_KEY, { path: "/" });
            res.clearCookie(STUDENT_CONFIG.LOGGED_IN_KEY, { path: "/" });
        }

        console.error('STUDENT auth failed:', error);

        return next(error);

    }


}



