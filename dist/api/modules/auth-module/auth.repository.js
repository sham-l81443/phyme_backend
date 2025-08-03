"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const user_1 = require("@/core/constants/ENUMS/user");
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
class AuthRepository {
    static async findUserByEmailAndRole({ email, role, isVerified }) {
        const user = await prisma_1.default.user.findFirst({
            where: Object.assign({ email,
                role }, (isVerified !== undefined && { isVerified: isVerified })),
            include: {
                class: true
            }
        });
        return user;
    }
    static async createNewStudentWithOtp({ name, email, classId, syllabusId, otpCode }) {
        const tx = prisma_1.default.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    registrationType: 'DEFAULT',
                    name,
                    role: user_1.UserRole.STUDENT,
                    syllabusId,
                    classId,
                    isTermsAccepted: true
                }
            });
            const otp = await AuthRepository.createNewOtp({ email: user.email, otpCode }, tx);
            return { user, otp };
        });
        return tx;
    }
    static async findValidOtpByEmail({ email }) {
        return await prisma_1.default.oTP.findFirst({
            where: {
                email,
                isUsed: false,
                expiry: { gte: new Date() }
            }
        });
    }
    static async markOtpAsUsed({ otpId }) {
        return await prisma_1.default.oTP.update({
            where: { id: otpId },
            data: { isUsed: true },
        });
    }
    static updateStudentPasswordAndVerify({ email, hashedPassword }) {
        return prisma_1.default.user.update({
            where: { email: email },
            data: {
                password: hashedPassword,
                isVerified: true,
            },
            select: {
                name: true,
                email: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
                phone: true,
                registrationType: true,
                classId: true,
                id: true,
                syllabusId: true
            },
        });
    }
    ;
    static updateStudentPassword({ email, hashedPassword }) {
        return prisma_1.default.user.update({
            where: {
                email
            },
            data: {
                password: hashedPassword
            },
            select: {
                name: true,
                email: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
                phone: true,
                registrationType: true,
                class: true,
                id: true,
            },
        });
    }
    static createNewOtp({ email, otpCode }, tx) {
        const client = tx !== null && tx !== void 0 ? tx : prisma_1.default;
        return client.oTP.create({
            data: {
                otp: otpCode,
                expiry: new Date(new Date().getTime() + 10 * 60 * 1000),
                email
            }
        });
    }
}
exports.AuthRepository = AuthRepository;
