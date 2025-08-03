"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoValidation = void 0;
const validationSchema_1 = require("@/core/constants/validationSchema");
const zod_1 = require("zod");
class VideoValidation {
}
exports.VideoValidation = VideoValidation;
VideoValidation.createVideo = zod_1.z.object({
    name: validationSchema_1.REQUIRED_STRING_SCHEMA,
    description: validationSchema_1.OPTIONAL_STRING_SCHEMA,
    embedLink: validationSchema_1.REQUIRED_STRING_SCHEMA,
    duration: validationSchema_1.OPTIONAL_STRING_SCHEMA,
    code: validationSchema_1.REQUIRED_STRING_SCHEMA,
    thumbnail: validationSchema_1.OPTIONAL_STRING_SCHEMA,
    lessonId: validationSchema_1.REQUIRED_STRING_SCHEMA,
});
