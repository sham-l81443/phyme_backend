"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_validation_1 = require("./auth.validation");
const AppError_1 = require("@/core/utils/errors/AppError");
const auth_service_1 = require("./auth.service");
const user_1 = require("@/core/constants/ENUMS/user");
const cookies_1 = require("@/core/utils/cookies");
const jwt_1 = require("@/core/utils/jwt");
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const auth_1 = require("@/core/config/auth");
class AuthController {
    static async studentRegisterController(req, res, next) {
        try {
            const validatedData = auth_validation_1.AuthValidation.registerSchema.safeParse(req.body);
            if (!validatedData.success) {
                throw new AppError_1.AppError({ errorType: "Bad Request", message: "Invalid request body", data: validatedData.error });
            }
            const newStudent = await auth_service_1.AuthService.studentRegisterService(validatedData.data);
            res.cookie(auth_1.STUDENT_CONFIG.STUDENT_USER_ID_TOKEN_KEY, newStudent.user.id, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: auth_1.STUDENT_CONFIG.userTokenExpiry,
                path: '/',
            });
            const data = { email: newStudent.user.email };
            const responseData = (0, responseCreator_1.default)({ data: data, message: 'User registered successfully' });
            res.status(201).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
    static async studentLoginController(req, res, next) {
        var _a;
        try {
            const validatedData = auth_validation_1.AuthValidation.loginSchema.safeParse(req.body);
            if (!validatedData.success) {
                throw new AppError_1.AppError({ errorType: "Bad Request", message: "Invalid request body", data: validatedData.error });
            }
            const student = await auth_service_1.AuthService.studentLoginService(validatedData.data);
            const refreshToken = await (0, jwt_1.generateRefreshToken)(student.id, user_1.UserRole.STUDENT);
            const accessToken = (0, jwt_1.generateStudentAccessToken)({ classId: ((_a = student.class) === null || _a === void 0 ? void 0 : _a.id) || '', email: student.email, id: student.id, role: user_1.UserRole.STUDENT, syllabusId: student.syllabusId || '' });
            (0, cookies_1.setRefreshTokenCookie)({ res, cookieValue: refreshToken.plainToken, usageType: user_1.UserRole.STUDENT });
            (0, cookies_1.setAccessTokenCookie)({ res, cookieValue: accessToken, usageType: user_1.UserRole.STUDENT });
            const responseObj = (0, responseCreator_1.default)({ data: {}, message: 'Login successful' });
            res.status(200).json(responseObj);
        }
        catch (error) {
            next(error);
        }
    }
    static async verifyStudentController(req, res, next) {
        try {
            const validatedData = auth_validation_1.AuthValidation.verifyEmailOtpPasswordSchema.safeParse(req.body);
            if (!validatedData.success) {
                throw new AppError_1.AppError({ errorType: "Bad Request", message: "Invalid request body", data: validatedData.error });
            }
            const { updatedUser, accessToken, refreshToken } = await auth_service_1.AuthService.verifyStudentService({ validatedData: validatedData.data });
            (0, cookies_1.setAccessTokenCookie)({ res, cookieValue: accessToken, usageType: user_1.UserRole.STUDENT });
            (0, cookies_1.setRefreshTokenCookie)({ res, cookieValue: refreshToken, usageType: user_1.UserRole.STUDENT });
            res.status(201).json((0, responseCreator_1.default)({
                data: updatedUser,
                message: "User verified successfully",
            }));
        }
        catch (error) {
            next(error);
        }
    }
    static async resetStudentPassword(req, res, next) {
        try {
            const updatedUser = auth_service_1.AuthService.resetStudentPassword(req.body);
            const responseData = (0, responseCreator_1.default)({ data: updatedUser, message: 'User password reset successful' });
            res.status(201).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
    static async getRestPasswordOtp(req, res, next) {
        var _a;
        console.log(req.body);
        try {
            const data = await auth_service_1.AuthService.getOtp({ body: req.body });
            res.status(201).json((0, responseCreator_1.default)({
                data: { email: (_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.email },
                message: "We have sent an otp to your email",
            }));
        }
        catch (error) {
            next(error);
        }
    }
    static async adminLoginController(req, res, next) {
        try {
            const { admin, token, refreshToken } = await auth_service_1.AuthService.adminLoginService({ body: req.body });
            (0, cookies_1.setAccessTokenCookie)({ res, cookieValue: token, usageType: user_1.UserRole.ADMIN });
            (0, cookies_1.setRefreshTokenCookie)({ res, cookieValue: refreshToken.plainToken, usageType: user_1.UserRole.ADMIN });
            const responseObj = (0, responseCreator_1.default)({ data: admin, message: 'Login successful' });
            res.status(200).json(responseObj);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
