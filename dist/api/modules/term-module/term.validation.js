"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermValidation = void 0;
const validationSchema_1 = require("@/core/constants/validationSchema");
const zod_1 = require("zod");
class TermValidation {
}
exports.TermValidation = TermValidation;
TermValidation.createTermSchema = zod_1.z.object({
    name: validationSchema_1.REQUIRED_STRING_SCHEMA,
    code: validationSchema_1.CODE_SCHEMA,
    classId: validationSchema_1.REQUIRED_STRING_SCHEMA,
    description: validationSchema_1.OPTIONAL_STRING_SCHEMA,
});
