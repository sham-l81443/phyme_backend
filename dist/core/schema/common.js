"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCHEMA = void 0;
const zod_1 = require("zod");
exports.SCHEMA = {
    uniqueCode: zod_1.z.string()
        .min(2, { message: "Unique code must be at least 2 characters." })
        .regex(/^[A-Z0-9]+$/, {
        message: "Unique code must contain only uppercase letters and numbers, with no spaces.",
    }),
    name: zod_1.z.string().min(2, { message: "Name must be at least 2 characters." }).max(20, { message: "Name must be at most 50 characters." }),
    description: zod_1.z.string().optional(),
    email: zod_1.z.string().email({ message: "please enter a valid email" }),
    phone: zod_1.z
        .string()
        .optional()
        .refine((val) => !val || /^[0-9]{10}$/.test(val), { message: "Please enter a valid phone number" }),
    required: zod_1.z.string().min(1, { message: "Field required" }),
    otp: zod_1.z.string().min(1, { message: "OTP required" }).refine((value) => /^\d+$/.test(value), { message: "OTP must contain only numbers" }),
    registrationTypeDefault: zod_1.z.enum(['DEFAULT', 'SSO']).default('DEFAULT'),
    password: zod_1.z.string().min(1, { message: "password is required" }).min(8, { message: "password must be at least 8 characters" }),
    confirmPassword: zod_1.z.string().min(1, { message: 'Confirm password required' }),
};
