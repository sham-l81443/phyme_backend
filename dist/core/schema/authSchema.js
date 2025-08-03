"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileSchema = exports.loginSchema = exports.verifySchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string({ message: "name is required" })
        .min(3, { message: "name must be at least 3 characters" })
        .max(20, { message: "name must be at most 20 characters" }),
    email: zod_1.z
        .string({ message: "email is required" })
        .email({ message: "invalid email" }),
    phone: zod_1.z
        .string({ message: "Phone number is required" })
        .regex(/^(\+?\d{1,3}[- ]?)?\d{10}$/, {
        message: "Invalid phone number format",
    }),
    registrationType: zod_1.z.enum(["SSO", "DEFAULT"])
});
exports.verifySchema = zod_1.z.object({
    otp: zod_1.z
        .string()
        .min(1, { message: "OTP required" })
        .refine((value) => /^\d+$/.test(value), {
        message: "OTP must contain only numbers",
    }),
    password: zod_1.z
        .string()
        .min(1, { message: "Password required" })
        .min(8, { message: "Password must be at least 8 charcters" })
        .regex(/^(?=.*[0-9])(?=.*[^A-Za-z0-9]).*$/, {
        message: "Password must include at least one number and one special character"
    }),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .transform((val) => val.toLowerCase().replace(/\s+/g, ""))
        .refine((val) => val.includes("@"), { message: "Invalid email address" }),
    password: zod_1.z
        .string()
        .min(1, { message: "Password is required" }),
});
exports.profileSchema = zod_1.z.object({
    fullName: common_1.SCHEMA.name,
    syllabusId: common_1.SCHEMA.required,
    classId: common_1.SCHEMA.required,
    parentEmail: common_1.SCHEMA.email.optional(),
    isUnderAged: zod_1.z.boolean().optional().default(false),
});
