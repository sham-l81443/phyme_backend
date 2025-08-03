"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdmin = void 0;
const AppError_1 = require("@/core/utils/errors/AppError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const generate_1 = require("@/core/utils/jwt/generate");
const generateRefreshToken_1 = require("@/core/utils/jwt/generateRefreshToken");
const schema_1 = require("@/core/schema");
const auth_1 = require("@/core/config/auth");
const user_1 = require("@/core/constants/ENUMS/user");
const cookies_1 = require("@/core/utils/cookies");
const authenticateAdmin = async (req, res, next) => {
    var _a, _b;
    try {
        const accessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[auth_1.ADMIN_CONFIG.ADMIN_ACCESS_TOKEN_KEY];
        if (accessToken) {
            try {
                if (!process.env.JWT_SECRET) {
                    throw new AppError_1.AppError({
                        errorType: "Internal Server Error",
                        message: "JWT_SECRET is not configured",
                    });
                }
                const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
                const parsed = schema_1.AdminAccessTokenSchema.safeParse(decoded);
                if (!parsed.success) {
                    throw new AppError_1.AppError({
                        errorType: "Unauthorized",
                        message: "Invalid token payload format",
                    });
                }
                if (parsed.data.role !== user_1.UserRole.ADMIN) {
                    throw new AppError_1.AppError({
                        errorType: "Unauthorized",
                        message: "Unauthorized access , refresh token not found, please login again "
                    });
                }
                req.user = parsed.data;
                return next();
            }
            catch (err) {
                res.clearCookie(auth_1.ADMIN_CONFIG.ADMIN_ACCESS_TOKEN_KEY, { path: '/' });
                if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                    console.log("Access token expired, attempting refresh token recovery");
                }
                else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    throw new AppError_1.AppError({
                        errorType: "Unauthorized",
                        message: "Invalid access token"
                    });
                }
                else if (err instanceof AppError_1.AppError) {
                    throw err;
                }
                else {
                    throw new AppError_1.AppError({
                        errorType: "Unauthorized",
                        message: "Token verification failed",
                        data: err
                    });
                }
            }
        }
        const refreshTokenCookie = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b[auth_1.ADMIN_CONFIG.ADMIN_REFRESH_TOKEN_KEY];
        if (!refreshTokenCookie) {
            throw new AppError_1.AppError({
                errorType: "Unauthorized",
                message: "Unauthorized access , refresh token not found, please login again "
            });
        }
        const tokenParts = refreshTokenCookie.split('.');
        if (tokenParts.length !== 2 || !tokenParts[0] || !tokenParts[1]) {
            throw new AppError_1.AppError({
                errorType: "Unauthorized",
                message: "Invalid refresh token format",
            });
        }
        const [tokenId, userRefreshToken] = tokenParts;
        if (!tokenId || !userRefreshToken) {
            throw new AppError_1.AppError({
                errorType: "Unauthorized",
                message: "Malformed refresh token"
            });
        }
        const result = await prisma_1.default.$transaction(async (tx) => {
            const refreshToken = await tx.refreshToken.findFirst({
                where: {
                    tokenId: tokenId,
                    isRevoked: false,
                    expiresAt: { gte: new Date() }
                },
                select: {
                    User: { select: { id: true, email: true } },
                    tokenSecret: true
                }
            });
            if (!refreshToken) {
                throw new AppError_1.AppError({
                    errorType: "Unauthorized",
                    message: "Refresh token expired or invalid"
                });
            }
            const isRefreshTokenValid = await bcrypt_1.default.compare(userRefreshToken, refreshToken.tokenSecret);
            if (!isRefreshTokenValid) {
                throw new AppError_1.AppError({
                    errorType: "Unauthorized",
                    message: "Invalid refresh token credentials"
                });
            }
            const admin = refreshToken.User;
            if (!admin) {
                throw new AppError_1.AppError({
                    errorType: "Unauthorized",
                    message: "Admin account not found"
                });
            }
            await tx.refreshToken.update({
                where: { tokenId: tokenId },
                data: { isRevoked: true }
            });
            return admin;
        }, { timeout: 5000 });
        const admin = result;
        const newRefreshToken = await (0, generateRefreshToken_1.generateRefreshToken)(admin.id, user_1.UserRole.STUDENT);
        const newAccessToken = (0, generate_1.generateAdminAccessToken)({
            email: admin.email,
            role: 'ADMIN',
            id: admin.id,
        });
        (0, cookies_1.setRefreshTokenCookie)({ res, cookieValue: newRefreshToken.plainToken, usageType: user_1.UserRole.ADMIN });
        (0, cookies_1.setAccessTokenCookie)({ res, cookieValue: newAccessToken, usageType: user_1.UserRole.ADMIN });
        req.user = {
            id: admin.id,
            email: admin.email,
            role: user_1.UserRole.ADMIN,
        };
        next();
    }
    catch (error) {
        if (error instanceof AppError_1.AppError && error.errorType === "Unauthorized") {
            res.clearCookie(auth_1.ADMIN_CONFIG.ADMIN_ACCESS_TOKEN_KEY, { path: "/" });
            res.clearCookie(auth_1.ADMIN_CONFIG.ADMIN_REFRESH_TOKEN_KEY, { path: "/" });
        }
        console.error('Admin auth failed:', error);
        return next(error);
    }
};
exports.authenticateAdmin = authenticateAdmin;
