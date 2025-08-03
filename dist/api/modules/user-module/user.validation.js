"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const validationSchema_1 = require("../../../core/constants/validationSchema");
const zod_1 = require("zod");
class UserValidation {
}
exports.UserValidation = UserValidation;
UserValidation.validateEmailSchema = zod_1.z.object({
    email: validationSchema_1.EMAIL_SCHEMA
});
UserValidation.validateIdSchema = zod_1.z.object({
    id: validationSchema_1.REQUIRED_STRING_SCHEMA
});
UserValidation.validateUpdateUserSchema = zod_1.z.object({
    id: validationSchema_1.REQUIRED_STRING_SCHEMA,
    data: zod_1.z.object({
        name: validationSchema_1.REQUIRED_STRING_SCHEMA,
        email: validationSchema_1.EMAIL_SCHEMA,
    })
});
