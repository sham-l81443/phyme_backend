"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const AppError_1 = require("@/core/utils/errors/AppError");
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const OTPService_1 = __importDefault(require("@/core/services/OTPService"));
const client_1 = require("@prisma/client");
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const authSchema_1 = require("@/core/lib/validitions/authSchema");
const auth_1 = require("@/core/config/auth");
const logger_1 = require("@/core/utils/logger");
const registerUser = async (req, res, next) => {
    try {
        const validatedData = authSchema_1.signupSchema.parse(req.body);
        const user = await prisma_1.default.user.findUnique({
            where: { email: validatedData.email }
        });
        if (user) {
            throw new AppError_1.AppError({ errorType: 'Bad Request', message: 'User with this email already exist' });
        }
        const otpResponse = await OTPService_1.default.sendOTPEmail(validatedData.email);
        if (!otpResponse.success) {
            throw new AppError_1.AppError({ errorType: 'Internal Server Error', message: 'Failed to send OTP' });
        }
        const transaction = await prisma_1.default.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: validatedData.email,
                    registrationType: validatedData.registrationType,
                    name: ''
                },
            });
            const otp = await tx.oTP.create({
                data: {
                    expiry: new Date(new Date().getTime() + 10 * 60 * 1000),
                    otp: otpResponse.otp,
                    userId: user.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            });
            return { user, otp };
        });
        if (!transaction) {
            throw new AppError_1.AppError({ errorType: 'Internal Server Error', message: 'Failed to create user' });
        }
        if (transaction) {
            res.cookie(auth_1.STUDENT_CONFIG.STUDENT_USER_ID_TOKEN_KEY, transaction.user.id, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: auth_1.STUDENT_CONFIG.userTokenExpiry,
                path: '/',
            });
            const data = { email: transaction.user.email };
            const responseData = (0, responseCreator_1.default)({ data: data, message: 'User registered successfully' });
            console.log(responseData);
            res.status(201).json(responseData);
        }
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
exports.registerUser = registerUser;
