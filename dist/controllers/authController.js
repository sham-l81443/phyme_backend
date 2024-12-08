"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const zod_1 = require("zod");
const schema_1 = require("../validators/schema");
const zodErrorHandler_1 = __importDefault(require("../utils/zodErrorHandler"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const OTPService_1 = __importDefault(require("../services/OTPService"));
const createResponse_1 = require("../utils/createResponse");
const registerUser = async (req, res) => {
    try {
        const validatedData = schema_1.registerSchema.parse(req.body);
        const isUser = await prisma_1.default.user.findUnique({
            where: { email: validatedData.email }
        });
        if (isUser) {
            res.status(400).json({ message: 'User with this email already exists' });
            return;
        }
        const otpResponse = await OTPService_1.default.sendOTPEmail(validatedData.email);
        if (!otpResponse.success) {
            throw new Error("Failed to send OTP");
        }
        const transaction = await prisma_1.default.$transaction(async (prisma) => {
            const hashedPassword = await bcrypt_1.default.hash(validatedData.password, 8);
            const user = await prisma.user.create({
                data: {
                    email: validatedData.email,
                    phoneNumber: validatedData.phoneNumber,
                    password: hashedPassword,
                },
            });
            const otp = await prisma.oTP.create({
                data: {
                    expiry: new Date(),
                    otp: otpResponse.otp,
                    userId: user.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            });
            return { user, otp };
        });
        if (transaction) {
            const responseData = (0, createResponse_1.createSuccessResponse)({ data: transaction.user, message: 'OTP sent successfully' });
            res.status(200).json(responseData);
        }
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errorMsg = (0, zodErrorHandler_1.default)(error);
            res.status(400).json({
                message: errorMsg,
            });
            return;
        }
        console.log(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message || 'unknown error' });
        }
        else {
            res.status(400).json({ message: 'unknown error' });
        }
    }
    ;
};
exports.registerUser = registerUser;
