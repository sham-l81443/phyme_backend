"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = generateRefreshToken;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const rethrowError_1 = require("../errors/rethrowError");
const auth_1 = require("@/core/config/auth");
const client_1 = require("@prisma/client");
const user_1 = require("@/core/constants/ENUMS/user");
const AppError_1 = require("../errors/AppError");
async function generateRefreshToken(id, usageType) {
    try {
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid userId');
        }
        if (![user_1.UserRole.ADMIN, user_1.UserRole.STUDENT].includes(usageType)) {
            throw new Error('Invalid usageType');
        }
        const userExists = await prisma_1.default.user.findUnique({ where: { id: id } });
        if (!userExists) {
            throw new AppError_1.AppError({ errorType: 'Not Found', message: `No ${usageType.toLowerCase()} found with id ${id}` });
        }
        const refreshToken = crypto_1.default.randomBytes(40).toString('hex');
        const tokenId = crypto_1.default.randomBytes(16).toString('hex');
        const hashedRefreshToken = await bcrypt_1.default.hash(refreshToken, 8);
        const plainToken = `${tokenId}.${refreshToken}`;
        const refreshTokenExpiry = usageType === user_1.UserRole.ADMIN ? auth_1.ADMIN_CONFIG.refreshTokenExpiry : auth_1.STUDENT_CONFIG.refreshTokenExpiry;
        if (!Number.isInteger(refreshTokenExpiry) || refreshTokenExpiry <= 0) {
            throw new Error('Invalid refreshTokenExpiry configuration');
        }
        const data = {
            tokenSecret: hashedRefreshToken,
            tokenId,
            expiresAt: new Date(Date.now() + refreshTokenExpiry),
            createdAt: new Date(),
            userId: id
        };
        await prisma_1.default.refreshToken.create({ data });
        return { plainToken };
    }
    catch (error) {
        console.error(`Failed to generate refresh token for user ${id} (${usageType}):`, error);
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw (0, rethrowError_1.rethrowAppError)(error, 'Unique constraint violation while generating refresh token');
        }
        (0, rethrowError_1.rethrowAppError)(error, 'Error generating refresh token');
    }
}
