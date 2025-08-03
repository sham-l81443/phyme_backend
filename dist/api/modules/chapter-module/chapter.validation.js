"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterValidation = void 0;
const validationSchema_1 = require("@/core/constants/validationSchema");
const zod_1 = require("zod");
class ChapterValidation {
}
exports.ChapterValidation = ChapterValidation;
ChapterValidation.createChapterSchema = zod_1.z.object({
    name: validationSchema_1.REQUIRED_STRING_SCHEMA,
    code: validationSchema_1.CODE_SCHEMA,
    termId: validationSchema_1.REQUIRED_STRING_SCHEMA,
    subjectId: validationSchema_1.REQUIRED_STRING_SCHEMA,
    description: validationSchema_1.OPTIONAL_STRING_SCHEMA,
});
ChapterValidation.findByTermIdAndSubjectIdSchema = zod_1.z.object({
    subjectId: validationSchema_1.REQUIRED_STRING_SCHEMA,
    termId: zod_1.z.array(validationSchema_1.REQUIRED_STRING_SCHEMA),
});
