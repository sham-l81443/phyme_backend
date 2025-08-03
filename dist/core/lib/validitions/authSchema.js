"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccountSchema = exports.signupSchema = exports.loginSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const EMAIL_SCHEMA = zod_1.default.string().min(1, { message: "Email is required" }).email({ message: "please enter a valid email" });
const REQUIRED_STRING_SCHEMA = zod_1.default.string().min(1, { message: "Field required" });
const PHONE_NUMBER_SCHEMA = zod_1.default
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), { message: "Please enter a valid phone number" });
const PASSWORD_SCHEMA = zod_1.default.string().min(1, { message: "password is required" }).min(8, { message: "password must be at least 8 characters" });
const REGISTRATION_TYPE_SCHEMA_DEFAULT = zod_1.default.enum(['DEFAULT', 'SSO']).default('DEFAULT');
const OTP_SCHEMA = zod_1.default.string().min(1, { message: "OTP required" }).refine((value) => /^\d+$/.test(value), { message: "OTP must contain only numbers" });
exports.loginSchema = zod_1.default.object({
    email: EMAIL_SCHEMA,
    password: REQUIRED_STRING_SCHEMA,
});
exports.signupSchema = zod_1.default.object({
    email: EMAIL_SCHEMA,
    registrationType: REGISTRATION_TYPE_SCHEMA_DEFAULT,
});
exports.verifyAccountSchema = zod_1.default.object({
    otp: OTP_SCHEMA,
    password: PASSWORD_SCHEMA,
    confirmPassword: zod_1.default.string().min(1, { message: 'Confirm password required' })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
