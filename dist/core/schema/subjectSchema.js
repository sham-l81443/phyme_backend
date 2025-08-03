"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.SubjectSchema = {
    create: zod_1.z.object({
        name: common_1.SCHEMA.name,
        classId: zod_1.z.string().min(1, { message: "Class ID is required" }),
        teacherName: zod_1.z.string().min(2).max(50).optional(),
        code: common_1.SCHEMA.uniqueCode
    }),
    update: zod_1.z.object({
        name: common_1.SCHEMA.name.optional(),
        classId: zod_1.z.number().int().positive({ message: "Class ID must be a positive number" }).optional(),
        teacherName: zod_1.z.string().min(2).max(50).optional(),
        code: common_1.SCHEMA.uniqueCode.optional()
    })
};
