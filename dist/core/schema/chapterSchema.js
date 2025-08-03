"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChapterSchema = exports.createChapterSchema = void 0;
const zod_1 = require("zod");
exports.createChapterSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, "Title must be at least 2 characters"),
    description: zod_1.z.string().min(3, "Description must be at least 3 characters"),
    class: zod_1.z.enum([
        "CLASS_ONE", "CLASS_TWO", "CLASS_THREE", "CLASS_FOUR", "CLASS_FIVE", "CLASS_SIX",
        "CLASS_SEVEN", "CLASS_EIGHT", "CLASS_NINE", "CLASS_TEN", "CLASS_ELEVEN", "CLASS_TWELVE"
    ])
});
exports.deleteChapterSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid chapter ID")
});
