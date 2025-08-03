"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = void 0;
const AppError_1 = require("../../utils/errors/AppError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signJwt = (payload, expiry = "1d") => {
    const secret = process.env.JWT_SECRET;
    if (!secret || typeof secret !== "string" || secret.length < 32) {
        throw new AppError_1.AppError({
            errorType: "Internal Server Error",
            message: "JWT secret is not configured properly",
        });
    }
    const algorithm = "HS256";
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: expiry, algorithm });
};
exports.signJwt = signJwt;
exports.default = exports.signJwt;
