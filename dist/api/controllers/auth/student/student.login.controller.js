"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("@/core/utils/errors/AppError");
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const authSchema_1 = require("@/core/schema/authSchema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const generate_1 = require("@/core/utils/jwt/generate");
const generateRefreshToken_1 = require("@/core/utils/jwt/generateRefreshToken");
const user_1 = require("@/core/constants/ENUMS/user");
const cookies_1 = require("@/core/utils/cookies");
const logger_1 = require("@/core/utils/logger");
const client_1 = require("@prisma/client");
const studentLogin = async (req, res, next) => {
    var _a;
    try {
        const validatedData = authSchema_1.loginSchema.parse(req.body);
        const user = await prisma_1.default.user.findUnique({
            where: { email: validatedData.email, isVerified: true },
            include: { class: true },
        });
        if (!user) {
            throw new AppError_1.AppError({ errorType: "Not Found", message: 'Invalid credentials or not verified' });
        }
        if (user === null || user === void 0 ? void 0 : user.password) {
            const isPasswordValid = await bcrypt_1.default.compare(validatedData.password, user.password);
            if (!isPasswordValid) {
                throw new AppError_1.AppError({ errorType: "Unauthorized", message: 'Invalid credentials' });
            }
        }
        logger_1.logger.log('user data', user);
        const refreshToken = await (0, generateRefreshToken_1.generateRefreshToken)(user.id, user_1.UserRole.STUDENT);
        const accessToken = (0, generate_1.generateStudentAccessToken)({ class: ((_a = user.class) === null || _a === void 0 ? void 0 : _a.code) || '', email: user.email, id: user.id, role: user_1.UserRole.STUDENT });
        (0, cookies_1.setRefreshTokenCookie)({ res, cookieValue: refreshToken.plainToken, usageType: user_1.UserRole.STUDENT });
        (0, cookies_1.setAccessTokenCookie)({ res, cookieValue: accessToken, usageType: user_1.UserRole.STUDENT });
        const responseObj = (0, responseCreator_1.default)({ data: {}, message: 'Login successful' });
        res.status(200).json(responseObj);
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
exports.default = studentLogin;
