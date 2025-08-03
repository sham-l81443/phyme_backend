"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TERMS_ACCEPTED_SCHEMA = exports.OTP_SCHEMA = exports.REGISTRATION_TYPE_SCHEMA_DEFAULT = exports.PASSWORD_SCHEMA = exports.PHONE_NUMBER_SCHEMA = exports.CODE_SCHEMA = exports.OPTIONAL_STRING_SCHEMA = exports.REQUIRED_NUMBER_SCHEMA = exports.REQUIRED_STRING_SCHEMA = exports.EMAIL_SCHEMA = void 0;
const zod_1 = require("zod");
exports.EMAIL_SCHEMA = zod_1.z.string().email({ message: "please enter a valid email" });
exports.REQUIRED_STRING_SCHEMA = zod_1.z.string().min(1, { message: "Field required" });
exports.REQUIRED_NUMBER_SCHEMA = zod_1.z.number().min(1, { message: "Field required" });
exports.OPTIONAL_STRING_SCHEMA = zod_1.z.string().optional();
exports.CODE_SCHEMA = zod_1.z
    .string()
    .min(1, { message: "Field required" })
    .refine((val) => /^[A-Z0-9]+$/.test(val), {
    message: "Code must contain only uppercase letters and numbers",
});
exports.PHONE_NUMBER_SCHEMA = zod_1.z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), { message: "Please enter a valid phone number" });
exports.PASSWORD_SCHEMA = zod_1.z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .refine((val) => /[A-Z]/.test(val), {
    message: "Password must contain at least one uppercase letter",
})
    .refine((val) => /[^a-zA-Z0-9]/.test(val), {
    message: "Password must contain at least one special character",
});
exports.REGISTRATION_TYPE_SCHEMA_DEFAULT = zod_1.z.enum(['DEFAULT', 'SSO']).default('DEFAULT');
exports.OTP_SCHEMA = zod_1.z.string().min(1, { message: "OTP required" }).refine((value) => /^\d+$/.test(value), { message: "OTP must contain only numbers" });
exports.TERMS_ACCEPTED_SCHEMA = zod_1.z.boolean().refine((value) => value === true, {
    message: "You must accept the terms and conditions",
});
