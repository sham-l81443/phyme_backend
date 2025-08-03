"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionValidation = void 0;
const validationSchema_1 = require("@/core/constants/validationSchema");
const zod_1 = require("zod");
class SubscriptionValidation {
}
exports.SubscriptionValidation = SubscriptionValidation;
SubscriptionValidation.createSubscriptionSchema = zod_1.z.object({
    termId: validationSchema_1.REQUIRED_STRING_SCHEMA,
    studentId: validationSchema_1.REQUIRED_STRING_SCHEMA
});
