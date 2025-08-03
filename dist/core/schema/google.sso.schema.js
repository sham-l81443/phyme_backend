"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleProfileSchema = void 0;
const zod_1 = require("zod");
exports.GoogleProfileSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Google ID is required"),
    emails: zod_1.z
        .array(zod_1.z.object({
        value: zod_1.z.string().email("Invalid email format"),
        verified: zod_1.z.boolean(),
    }))
        .min(1, "At least one email is required"),
    displayName: zod_1.z.string().optional(),
    photos: zod_1.z
        .array(zod_1.z.object({
        value: zod_1.z.string().url("Invalid photo URL").optional(),
    }))
        .optional(),
});
