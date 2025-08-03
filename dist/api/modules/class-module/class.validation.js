"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassValidation = void 0;
const validationSchema_1 = require("../../../core/constants/validationSchema");
const zod_1 = require("zod");
class ClassValidation {
}
exports.ClassValidation = ClassValidation;
ClassValidation.createClassSchema = zod_1.z.object({
    name: validationSchema_1.REQUIRED_STRING_SCHEMA,
    description: validationSchema_1.OPTIONAL_STRING_SCHEMA,
    code: validationSchema_1.CODE_SCHEMA,
    syllabusId: validationSchema_1.REQUIRED_STRING_SCHEMA
});
ClassValidation.getClassBySyllabusSchema = zod_1.z.object({
    syllabusId: validationSchema_1.REQUIRED_STRING_SCHEMA
});
