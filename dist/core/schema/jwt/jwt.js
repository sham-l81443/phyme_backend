"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAccessTokenSchema = exports.StudentAccessTokenSchema = void 0;
const zod_1 = require("zod");
exports.StudentAccessTokenSchema = zod_1.z.object({
    id: zod_1.z.string().uuid({ message: "Invalid or missing user ID (must be a valid UUID)" }),
    email: zod_1.z.string().email({ message: "Invalid or missing email" }),
    classId: zod_1.z.string({
        errorMap: () => ({ message: "Invalid or missing class" }),
    }).uuid({ message: "Invalid or missing class" }),
    syllabusId: zod_1.z.string({
        errorMap: () => ({ message: "Invalid or missing syllabus" }),
    }).uuid({ message: "Invalid or missing syllabus" }),
    role: zod_1.z.enum(["STUDENT"], {
        errorMap: () => ({ message: "Invalid or missing role" }),
    }),
});
exports.AdminAccessTokenSchema = zod_1.z.object({
    id: zod_1.z.string().uuid({ message: "Invalid or missing user ID (must be a valid UUID)" }),
    email: zod_1.z.string().email({ message: "Invalid or missing email" }),
    role: zod_1.z.enum(["ADMIN"], {
        errorMap: () => ({ message: "Invalid or missing role" }),
    }),
});
