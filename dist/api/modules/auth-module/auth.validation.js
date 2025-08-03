"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const validationSchema_1 = require("@/core/constants/validationSchema");
const zod_1 = require("zod");
class AuthValidation {
}
exports.AuthValidation = AuthValidation;
AuthValidation.loginSchema = zod_1.z.object({
    email: validationSchema_1.EMAIL_SCHEMA,
    password: validationSchema_1.REQUIRED_STRING_SCHEMA,
});
AuthValidation.registerSchema = zod_1.z.object({
    name: validationSchema_1.REQUIRED_STRING_SCHEMA,
    email: validationSchema_1.EMAIL_SCHEMA,
    syllabusId: validationSchema_1.REQUIRED_STRING_SCHEMA,
    classId: validationSchema_1.REQUIRED_STRING_SCHEMA,
    isTermsAccepted: validationSchema_1.TERMS_ACCEPTED_SCHEMA,
});
AuthValidation.verifyEmailOtpPasswordSchema = zod_1.z.object({
    email: validationSchema_1.EMAIL_SCHEMA,
    otp: validationSchema_1.OTP_SCHEMA,
    password: validationSchema_1.PASSWORD_SCHEMA,
});
AuthValidation.verifyEmailSchema = zod_1.z.object({
    email: validationSchema_1.EMAIL_SCHEMA
});
