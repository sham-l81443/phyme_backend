"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyStudent = void 0;
const AppError_1 = require("@/core/utils/errors/AppError");
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const authSchema_1 = require("@/core/schema/authSchema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const generate_1 = require("@/core/utils/jwt/generate");
const generateRefreshToken_1 = require("@/core/utils/jwt/generateRefreshToken");
const user_1 = require("@/core/constants/ENUMS/user");
const auth_1 = require("@/core/config/auth");
const cookies_1 = require("@/core/utils/cookies");
const client_1 = require("@prisma/client");
const logger_1 = require("@/core/utils/logger");
const verifyStudent = async (req, res, next) => {
    var _a, _b;
    try {
        console.log('started verify user');
        const userId = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[auth_1.STUDENT_CONFIG.STUDENT_USER_ID_TOKEN_KEY];
        console.log('reading user id from cookie', userId);
        if (!userId) {
            res.clearCookie(auth_1.STUDENT_CONFIG.STUDENT_USER_ID_TOKEN_KEY);
            throw new AppError_1.AppError({ errorType: "Unauthorized", message: "User does not exist" });
        }
        console.log('verifiying request body', req.body);
        const validatedData = authSchema_1.verifySchema.parse(req.body);
        const otpData = await prisma_1.default.oTP.findFirst({
            where: {
                userId: userId,
                isUsed: false,
                expiry: { gte: new Date() }
            }
        });
        if (!otpData || otpData.otp !== validatedData.otp) {
            throw new AppError_1.AppError({ errorType: "Unauthorized", message: "Please provide a valid OTP" });
        }
        await prisma_1.default.oTP.update({
            where: { id: otpData.id },
            data: { isUsed: true },
        });
        const encryptedPassword = await bcrypt_1.default.hash(validatedData.password, 10);
        const updatedUser = await prisma_1.default.user.update({
            where: { id: userId },
            data: {
                password: encryptedPassword,
                isVerified: true
            },
            select: {
                name: true,
                email: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
                phone: true,
                registrationType: true,
                subscriptionType: true,
                class: true,
                id: true
            }
        });
        const refreshToken = await (0, generateRefreshToken_1.generateRefreshToken)(userId, user_1.UserRole.STUDENT);
        const token = (0, generate_1.generateStudentAccessToken)({ class: ((_b = updatedUser.class) === null || _b === void 0 ? void 0 : _b.name) || '', email: updatedUser.email, id: updatedUser.id, role: 'STUDENT', subscriptionType: updatedUser.subscriptionType });
        console.log(token, 'jwt token fron util fucntion');
        (0, cookies_1.setRefreshTokenCookie)({ res, cookieValue: refreshToken.plainToken, usageType: user_1.UserRole.STUDENT });
        (0, cookies_1.setAccessTokenCookie)({ res, cookieValue: token, usageType: user_1.UserRole.STUDENT });
        const resObj = (0, responseCreator_1.default)({
            data: updatedUser,
            message: "User verified successfully"
        });
        res.status(201).json(resObj);
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            logger_1.logger.error("Database error", { error: error.message });
            return next(new AppError_1.AppError({ errorType: "Internal Server Error", message: "Database unavailable" }));
        }
        logger_1.logger.error("Google login error", { error: error instanceof Error ? error.message : String(error) });
        next(error);
    }
};
exports.verifyStudent = verifyStudent;
