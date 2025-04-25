import { COMMON_CONFIG } from "@/config/auth";
import { UserRole } from "@/constants/enums/user";
import prisma from "@/lib/prisma";
import { GoogleProfileSchema, IGoogleProfile } from "@/schema/google.sso.schema";
import { IController } from "@/types";
import { setRefreshTokenCookie, setAccessTokenCookie } from "@/utils/cookies/setRefreshCookie";
import { generateRefreshToken, generateStudentAccessToken } from "@/utils/jwt";
import { logger } from "@/utils/logger";
import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

/**
 * Handles both Google authentication and registration
 * @param isRegisterFlow If true, handles registration flow. If false, handles login flow
 */
export const googleAuthController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isRegisterFlow = req.query.state === 'register'

        console.log(req.query, '>>>>>>>>>>>>>>>>>')
        // Parse and validate Google profile data
        const googleProfile = GoogleProfileSchema.safeParse(req?.user);
        if (!googleProfile.success) {
            const errorMessage = googleProfile.error.issues.map((issue) => issue.message).join(", ");
            logger.warn("Invalid Google profile data", {
                errors: googleProfile.error.issues,
                profile: req?.user,
            });
            res.cookie('sso-error', errorMessage, { httpOnly: false, sameSite: 'lax', secure: true });
            res.redirect(COMMON_CONFIG.FAILURE_REDIRECT_URL);
            return;
        }

        const { id, emails, displayName, photos } = googleProfile.data as IGoogleProfile;

        // Check if email is verified
        if (!emails[0].verified) {
            logger.warn("Unverified Google email", { email: emails[0].value });
            res.cookie('sso-error', 'Email not verified', { httpOnly: false, sameSite: 'lax', secure: true });
            res.redirect(COMMON_CONFIG.FAILURE_REDIRECT_URL);
            return;
        }

        const email = emails[0].value;
        const name = displayName || "Unknown";
        const avatar = photos?.[0]?.value || null;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { googleId: id },
            include: { class: true }
        });

        // Handle based on whether this is a login or register flow
        if (isRegisterFlow) {
            // Registration flow
            if (existingUser) {
                // User already exists - error in registration flow
                res.cookie('sso-error', 'Account already exists please log in', { httpOnly: false, sameSite: 'lax', secure: true });
                res.redirect(COMMON_CONFIG.FAILURE_REDIRECT_URL);
                return;
            }

            // Create new user
            const newUser = await prisma.user.create({
                data: {
                    email: email,
                    name: name,
                    googleId: id,
                    registrationType: "SSO",
                    avatar: avatar,
                    isVerified: emails[0].verified,
                }
            });

            // Generate tokens
            const refreshToken = await generateRefreshToken(newUser.id, UserRole.STUDENT);
            const accessToken = generateStudentAccessToken({
                class: 'unknown',
                email: newUser.email,
                id: newUser.id,
                role: UserRole.STUDENT,
                subscriptionType: newUser.subscriptionType
            });

            // Set cookies
            setRefreshTokenCookie({ res, cookieValue: refreshToken.plainToken, usageType: UserRole.STUDENT });
            setAccessTokenCookie({ res, cookieValue: accessToken, usageType: UserRole.STUDENT });

            res.cookie('sso-success', 'registration successful', { httpOnly: false, sameSite: 'lax', secure: true });
            res.cookie('is-profile-completed', newUser.isProfileComplete, { httpOnly: false, sameSite: 'lax', secure: true });
            res.redirect(COMMON_CONFIG.SUCCESS_REDIRECT_URL);
            return;
        } else {
            // Login flow
            if (!existingUser) {
                // User not found in login flow
                res.cookie('sso-error', 'User not found or is not verified', { httpOnly: false, sameSite: 'lax', secure: true });
                res.redirect(COMMON_CONFIG.FAILURE_REDIRECT_URL);
                return;
            }

            // Generate tokens
            const refreshToken = await generateRefreshToken(existingUser.id, UserRole.STUDENT);
            const accessToken = generateStudentAccessToken({
                class: existingUser.class?.name || 'unknown',
                email: existingUser.email,
                id: existingUser.id,
                role: UserRole.STUDENT,
                subscriptionType: existingUser.subscriptionType
            });

            // Set cookies
            setRefreshTokenCookie({ res, cookieValue: refreshToken.plainToken, usageType: UserRole.STUDENT });
            setAccessTokenCookie({ res, cookieValue: accessToken, usageType: UserRole.STUDENT });

            res.cookie('sso-success', 'login successful', { httpOnly: false, sameSite: 'lax', secure: true });
            res.redirect(COMMON_CONFIG.SUCCESS_REDIRECT_URL);
            return;
        }

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            logger.error("Database error", { error: error.message });
        } else {
            logger.error("Google authentication error", { error: error instanceof Error ? error.message : String(error) });
        }

        res.cookie('sso-error', error instanceof Error ? error.message : 'something went wrong', { httpOnly: false, sameSite: 'lax', secure: true });
        res.redirect(COMMON_CONFIG.FAILURE_REDIRECT_URL);
        return;
    }
};



export default googleAuthController;