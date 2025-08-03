"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNoteSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createNoteSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    content: zod_1.z.string().min(1, "Content is required"),
    importance: zod_1.z.enum([client_1.IMPORTANCE.LOW, client_1.IMPORTANCE.MEDIUM, client_1.IMPORTANCE.HIGH]),
    chapterId: zod_1.z.string().uuid("Invalid chapter ID")
});
