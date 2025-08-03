"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoResponseSchema = exports.UpdateVideoSchema = exports.CreateVideoSchema = void 0;
const zod_1 = require("zod");
const videoBaseSchema = {
    name: zod_1.z.string().min(1, 'Name is required'),
    description: zod_1.z.string().optional().nullable(),
    embedLink: zod_1.z.string().url('Invalid video URL'),
    duration: zod_1.z.string().optional().nullable(),
    date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
    }),
    isFree: zod_1.z.boolean(),
    thumbnail: zod_1.z.string().url('Invalid thumbnail URL').optional().nullable(),
    classId: zod_1.z.number(),
    videoType: zod_1.z.string().optional(),
    noteId: zod_1.z.string().uuid().optional().nullable(),
    code: zod_1.z.string().min(2, { message: "Code must be at least 2 characters long" })
};
exports.CreateVideoSchema = zod_1.z.object(Object.assign({}, videoBaseSchema));
exports.UpdateVideoSchema = zod_1.z.object(Object.assign({}, videoBaseSchema)).partial();
exports.VideoResponseSchema = zod_1.z.object(Object.assign(Object.assign({}, videoBaseSchema), { id: zod_1.z.string().uuid(), createdAt: zod_1.z.date(), updatedAt: zod_1.z.date() }));
