"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthController = void 0;
const auth_1 = require("@/core/config/auth");
const user_1 = require("@/core/constants/ENUMS/user");
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const google_sso_schema_1 = require("@/core/schema/google.sso.schema");
const cookies_1 = require("@/core/utils/cookies");
const jwt_1 = require("@/core/utils/jwt");
const logger_1 = require("@/core/utils/logger");
const client_1 = require("@prisma/client");
const googleAuthController = async (req, res, next) => {
    var _a, _b;
    try {
        const isRegisterFlow = req.query.state === 'register';
        console.log(req.query, '>>>>>>>>>>>>>>>>>');
        const googleProfile = google_sso_schema_1.GoogleProfileSchema.safeParse(req === null || req === void 0 ? void 0 : req.user);
        if (!googleProfile.success) {
            const errorMessage = googleProfile.error.issues.map((issue) => issue.message).join(", ");
            logger_1.logger.warn("Invalid Google profile data", {
                errors: googleProfile.error.issues,
                profile: req === null || req === void 0 ? void 0 : req.user,
            });
            res.cookie('sso-error', errorMessage, { httpOnly: false, sameSite: 'lax', secure: true });
            res.redirect(auth_1.COMMON_CONFIG.FAILURE_REDIRECT_URL);
            return;
        }
        const { id, emails, displayName, photos } = googleProfile.data;
        if (!emails[0].verified) {
            logger_1.logger.warn("Unverified Google email", { email: emails[0].value });
            res.cookie('sso-error', 'Email not verified', { httpOnly: false, sameSite: 'lax', secure: true });
            res.redirect(auth_1.COMMON_CONFIG.FAILURE_REDIRECT_URL);
            return;
        }
        const email = emails[0].value;
        const name = displayName || "Unknown";
        const avatar = ((_a = photos === null || photos === void 0 ? void 0 : photos[0]) === null || _a === void 0 ? void 0 : _a.value) || null;
        const existingUser = await prisma_1.default.user.findUnique({
            where: { googleId: id },
            include: { class: true }
        });
        if (isRegisterFlow) {
            if (existingUser) {
                res.cookie('sso-error', 'Account already exists please log in', { httpOnly: false, sameSite: 'lax', secure: true });
                res.redirect(auth_1.COMMON_CONFIG.FAILURE_REDIRECT_URL);
                return;
            }
            const newUser = await prisma_1.default.user.create({
                data: {
                    email: email,
                    name: name,
                    googleId: id,
                    registrationType: "SSO",
                    avatar: avatar,
                    isVerified: emails[0].verified,
                }
            });
            const refreshToken = await (0, jwt_1.generateRefreshToken)(newUser.id, user_1.UserRole.STUDENT);
            const accessToken = (0, jwt_1.generateStudentAccessToken)({
                class: 'unknown',
                email: newUser.email,
                id: newUser.id,
                role: user_1.UserRole.STUDENT,
                subscriptionType: newUser.subscriptionType
            });
            (0, cookies_1.setRefreshTokenCookie)({ res, cookieValue: refreshToken.plainToken, usageType: user_1.UserRole.STUDENT });
            (0, cookies_1.setAccessTokenCookie)({ res, cookieValue: accessToken, usageType: user_1.UserRole.STUDENT });
            res.cookie('sso-success', 'registration successful', { httpOnly: false, sameSite: 'lax', secure: true });
            res.cookie('is-profile-completed', newUser.isProfileComplete, { httpOnly: false, sameSite: 'lax', secure: true });
            res.redirect(auth_1.COMMON_CONFIG.SUCCESS_REDIRECT_URL);
            return;
        }
        else {
            if (!existingUser) {
                res.cookie('sso-error', 'User not found or is not verified', { httpOnly: false, sameSite: 'lax', secure: true });
                res.redirect(auth_1.COMMON_CONFIG.FAILURE_REDIRECT_URL);
                return;
            }
            const refreshToken = await (0, jwt_1.generateRefreshToken)(existingUser.id, user_1.UserRole.STUDENT);
            const accessToken = (0, jwt_1.generateStudentAccessToken)({
                class: ((_b = existingUser.class) === null || _b === void 0 ? void 0 : _b.name) || 'unknown',
                email: existingUser.email,
                id: existingUser.id,
                role: user_1.UserRole.STUDENT,
                subscriptionType: existingUser.subscriptionType
            });
            (0, cookies_1.setRefreshTokenCookie)({ res, cookieValue: refreshToken.plainToken, usageType: user_1.UserRole.STUDENT });
            (0, cookies_1.setAccessTokenCookie)({ res, cookieValue: accessToken, usageType: user_1.UserRole.STUDENT });
            (0, cookies_1.setLoggedInCookie)({ res, cookieValue: 'true', usageType: user_1.UserRole.STUDENT });
            res.cookie('sso-success', 'login successful', { httpOnly: false, sameSite: 'lax', secure: true });
            res.redirect(auth_1.COMMON_CONFIG.SUCCESS_REDIRECT_URL);
            return;
        }
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            logger_1.logger.error("Database error", { error: error.message });
        }
        else {
            logger_1.logger.error("Google authentication error", { error: error instanceof Error ? error.message : String(error) });
        }
        res.cookie('sso-error', error instanceof Error ? error.message : 'something went wrong', { httpOnly: false, sameSite: 'lax', secure: true });
        res.redirect(auth_1.COMMON_CONFIG.FAILURE_REDIRECT_URL);
        return;
    }
};
exports.googleAuthController = googleAuthController;
exports.default = exports.googleAuthController;
