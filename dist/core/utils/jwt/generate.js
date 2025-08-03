"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdminAccessToken = exports.generateStudentAccessToken = void 0;
const AppError_1 = require("@/core/utils/errors/AppError");
const schema_1 = require("@/core/schema");
const _1 = require(".");
const rethrowError_1 = require("../errors/rethrowError");
const auth_1 = require("@/core/config/auth");
const generateStudentAccessToken = (params) => {
    try {
        const parsed = schema_1.StudentAccessTokenSchema.safeParse(params);
        if (!parsed.success) {
            throw new AppError_1.AppError({
                errorType: "Bad Request",
                message: parsed.error.errors.map((err) => err.message).join(", "),
            });
        }
        const { id, email, role, classId, syllabusId } = parsed.data;
        const payload = { id, email, role, classId, syllabusId };
        return (0, _1.signJwt)(payload, auth_1.STUDENT_CONFIG.jwtAccessTokenExpiry);
    }
    catch (error) {
        (0, rethrowError_1.rethrowAppError)(error, 'Failed to generate student JWT');
    }
};
exports.generateStudentAccessToken = generateStudentAccessToken;
const generateAdminAccessToken = (params) => {
    try {
        const parsed = schema_1.AdminAccessTokenSchema.safeParse(params);
        if (!parsed.success) {
            throw new AppError_1.AppError({
                errorType: "Bad Request",
                message: parsed.error.errors.map((err) => err.message).join(", "),
            });
        }
        const { id, email, role } = parsed.data;
        const payload = { id, email, role };
        return (0, _1.signJwt)(payload, auth_1.ADMIN_CONFIG.jwtAccessTokenExpiry);
    }
    catch (error) {
        (0, rethrowError_1.rethrowAppError)(error, 'Failed to generate student JWT');
    }
};
exports.generateAdminAccessToken = generateAdminAccessToken;
