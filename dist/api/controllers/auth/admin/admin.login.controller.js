"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("@/core/utils/errors/AppError");
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const generate_1 = require("@/core/utils/jwt/generate");
const generateRefreshToken_1 = require("@/core/utils/jwt/generateRefreshToken");
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const authSchema_1 = require("@/core/schema/authSchema");
const user_1 = require("@/core/constants/ENUMS/user");
const cookies_1 = require("@/core/utils/cookies");
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const logger_1 = require("@/core/utils/logger");
const auth_1 = require("@/core/config/auth");
const adminLoginController = async (req, res, next) => {
    const data = await bcrypt_1.default.hash('Sudoski101@', 10);
    console.log('=================', data, '========================');
    try {
        const validatedData = authSchema_1.loginSchema.parse(req.body);
        logger_1.logger.info('Admin login attempt', { email: validatedData.email });
        let admin;
        try {
            admin = await prisma_1.default.admin.findUnique({
                where: {
                    email: validatedData.email,
                    isVerified: true,
                },
            });
            console.log('admin password', admin);
            console.log('validated password', validatedData.password);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new AppError_1.AppError({ errorType: 'Internal Server Error', message: 'Database query failed' });
            }
            throw error;
        }
        if (!admin) {
            throw new AppError_1.AppError({ errorType: 'Unauthorized', message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt_1.default.compare(validatedData.password, admin.password);
        if (!isPasswordValid) {
            throw new AppError_1.AppError({ errorType: 'Unauthorized', message: 'Invalid email or password' });
        }
        const token = (0, generate_1.generateAdminAccessToken)({ id: admin.id, role: user_1.UserRole.ADMIN, email: admin.email });
        const refreshToken = await (0, generateRefreshToken_1.generateRefreshToken)(admin.id, user_1.UserRole.ADMIN);
        if (!refreshToken) {
            throw new AppError_1.AppError({ errorType: 'Internal Server Error', message: 'Failed to generate refresh token' });
        }
        (0, cookies_1.setRefreshTokenCookie)({
            res,
            cookieValue: refreshToken.plainToken,
            usageType: user_1.UserRole.ADMIN,
        });
        (0, cookies_1.setAccessTokenCookie)({
            res,
            cookieValue: token,
            usageType: user_1.UserRole.ADMIN,
        });
        const resObj = (0, responseCreator_1.default)({
            message: 'Logged in successfully',
            data: {
                isAdmin: true,
                email: admin.email,
                expiresIn: auth_1.ADMIN_CONFIG.accessTokenExpiry,
            },
        });
        return res.status(200).json(resObj);
    }
    catch (e) {
        next(e);
    }
};
exports.default = adminLoginController;
