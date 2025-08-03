"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_1 = require("@/core/constants/ENUMS/user");
const AppError_1 = require("@/core/utils/errors/AppError");
const rethrowError_1 = require("@/core/utils/errors/rethrowError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_repository_1 = require("./auth.repository");
const OTPService_1 = __importDefault(require("@/core/services/OTPService"));
const jwt_1 = require("@/core/utils/jwt");
const auth_validation_1 = require("./auth.validation");
class AuthService {
    static async studentLoginService({ email, password }) {
        try {
            const student = await auth_repository_1.AuthRepository.findUserByEmailAndRole({ email, role: user_1.UserRole.STUDENT, isVerified: true });
            if (!student) {
                throw new AppError_1.AppError({ errorType: "Not Found", message: 'Invalid credentials or not verified' });
            }
            if (student === null || student === void 0 ? void 0 : student.password) {
                const isPasswordValid = await bcrypt_1.default.compare(password, student.password);
                if (!isPasswordValid) {
                    throw new AppError_1.AppError({ errorType: "Unauthorized", message: 'Invalid credentials' });
                }
            }
            const { password: _ } = student, safeStudent = __rest(student, ["password"]);
            return safeStudent;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to login student');
        }
    }
    static async studentRegisterService({ name, email, classId, syllabusId }) {
        try {
            const user = await auth_repository_1.AuthRepository.findUserByEmailAndRole({ email, role: user_1.UserRole.STUDENT });
            if (user && user.isVerified) {
                throw new AppError_1.AppError({ errorType: 'Bad Request', message: 'User with this email already exist' });
            }
            const otpResponse = await OTPService_1.default.sendOTPEmail(email);
            if (!otpResponse.success) {
                throw new AppError_1.AppError({ errorType: 'Internal Server Error', message: 'Failed to send OTP' });
            }
            if (user && !(user === null || user === void 0 ? void 0 : user.isVerified)) {
                await auth_repository_1.AuthRepository.createNewOtp({ email, otpCode: otpResponse.otp });
                return { otpResponse, user };
            }
            const transaction = await auth_repository_1.AuthRepository.createNewStudentWithOtp({ name, email, classId, syllabusId, otpCode: otpResponse.otp });
            if (!transaction) {
                throw new AppError_1.AppError({ errorType: 'Internal Server Error', message: 'Failed to create user' });
            }
            return transaction;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to register student');
        }
    }
    static async verifyStudentService({ validatedData }) {
        try {
            const otpData = await auth_repository_1.AuthRepository.findValidOtpByEmail({ email: validatedData.email });
            if (!otpData || otpData.otp !== validatedData.otp) {
                throw new AppError_1.AppError({ errorType: "Unauthorized", message: "Please provide a valid OTP" });
            }
            await auth_repository_1.AuthRepository.markOtpAsUsed({ otpId: otpData.id });
            const hashedPassword = await bcrypt_1.default.hash(validatedData.password, 10);
            const updatedUser = await auth_repository_1.AuthRepository.updateStudentPasswordAndVerify({ email: validatedData.email, hashedPassword: hashedPassword });
            if (!updatedUser) {
                throw new AppError_1.AppError({ errorType: "Bad Request", message: "Failed to verify user" });
            }
            const accessToken = (0, jwt_1.generateStudentAccessToken)({
                classId: updatedUser.classId || '',
                email: updatedUser.email,
                id: updatedUser.id,
                role: user_1.UserRole.STUDENT,
                syllabusId: updatedUser.syllabusId || '',
            });
            const refreshToken = await (0, jwt_1.generateRefreshToken)(updatedUser.id, user_1.UserRole.STUDENT);
            return {
                updatedUser,
                accessToken,
                refreshToken: refreshToken.plainToken,
            };
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to verify student');
        }
    }
    static async resetStudentPassword({ body }) {
        try {
            const validatedData = auth_validation_1.AuthValidation.verifyEmailOtpPasswordSchema.safeParse(body);
            if (!validatedData.success) {
                throw new AppError_1.AppError({ errorType: "Bad Request", message: "Invalid request body", data: validatedData.error });
            }
            const { email, password, otp } = validatedData === null || validatedData === void 0 ? void 0 : validatedData.data;
            const user = await auth_repository_1.AuthRepository.findUserByEmailAndRole({ email, role: user_1.UserRole.STUDENT, isVerified: true });
            if (!user) {
                throw new AppError_1.AppError({ errorType: "Not Found", message: 'Invalid credentials or not verified' });
            }
            const otpData = await auth_repository_1.AuthRepository.findValidOtpByEmail({ email });
            if (!otpData || otpData.otp !== otp) {
                throw new AppError_1.AppError({ errorType: "Unauthorized", message: "Please provide a valid OTP" });
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const updatedUser = auth_repository_1.AuthRepository.updateStudentPassword({ email, hashedPassword });
            return updatedUser;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'failed to reset passWord');
        }
    }
    static async getOtp({ body }) {
        const { email } = body;
        try {
            const validatedData = auth_validation_1.AuthValidation.verifyEmailSchema.safeParse({ email });
            if (!validatedData.success) {
                throw new AppError_1.AppError({ errorType: "Bad Request", message: "Invalid request body", data: validatedData.error });
            }
            const user = await auth_repository_1.AuthRepository.findUserByEmailAndRole({ email, role: user_1.UserRole.STUDENT, isVerified: true });
            if (!user) {
                throw new AppError_1.AppError({ errorType: 'Not Found', message: 'No user found with this email' });
            }
            const otpResponse = await OTPService_1.default.sendOTPEmail(email);
            await auth_repository_1.AuthRepository.createNewOtp({ email, otpCode: otpResponse.otp });
            if (!otpResponse.success) {
                throw new AppError_1.AppError({ errorType: 'Internal Server Error', message: 'Failed to send OTP' });
            }
            return { otpResponse, user };
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'failed to get otp');
        }
    }
    static async adminLoginService({ body }) {
        try {
            const validatedData = auth_validation_1.AuthValidation.loginSchema.safeParse(body);
            if (!validatedData.success) {
                throw new AppError_1.AppError({ errorType: "Bad Request", message: "Invalid request body", data: validatedData.error });
            }
            const { email, password } = validatedData === null || validatedData === void 0 ? void 0 : validatedData.data;
            const admin = await auth_repository_1.AuthRepository.findUserByEmailAndRole({ email, role: user_1.UserRole.ADMIN, isVerified: true });
            if (!admin) {
                throw new AppError_1.AppError({ errorType: "Not Found", message: 'Invalid credentials or not verified' });
            }
            if (admin === null || admin === void 0 ? void 0 : admin.password) {
                const isPasswordValid = await bcrypt_1.default.compare(password, admin.password);
                if (!isPasswordValid) {
                    throw new AppError_1.AppError({ errorType: "Unauthorized", message: 'Invalid credentials' });
                }
            }
            const token = (0, jwt_1.generateAdminAccessToken)({ id: admin.id, role: user_1.UserRole.ADMIN, email: admin.email });
            const refreshToken = await (0, jwt_1.generateRefreshToken)(admin.id, user_1.UserRole.ADMIN);
            if (!refreshToken) {
                throw new AppError_1.AppError({ errorType: 'Internal Server Error', message: 'Failed to generate refresh token' });
            }
            const { password: _ } = admin, safeAdmin = __rest(admin, ["password"]);
            return { admin: safeAdmin, token, refreshToken };
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'failed to login admin');
        }
    }
}
exports.AuthService = AuthService;
