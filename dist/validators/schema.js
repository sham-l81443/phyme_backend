"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string({ message: "name is required" }).min(3, { "message": "name must be at least 3 characters" }).max(20, { "message": "name must be at most 20 characters" }),
    email: zod_1.z.string({ message: "email is required" }).email({ message: "invalid email" }),
    password: zod_1.z.string().min(6),
    phoneNumber: zod_1.z
        .string({ message: "Phone number is required" })
        .regex(/^(\+?\d{1,3}[- ]?)?\d{10}$/, { message: "Invalid phone number format" }),
    role: zod_1.z.enum(["user", "admin"], { message: "role must be either 'user' or 'admin'" }).optional(),
});
