"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectService = void 0;
const validateData_1 = require("../../../core/utils/dto/validateData");
const rethrowError_1 = require("../../../core/utils/errors/rethrowError");
const subject_validation_1 = require("./subject.validation");
const subject_repository_1 = require("./subject.repository");
class SubjectService {
    static async createSubjectService(body) {
        try {
            const validateData = (0, validateData_1.validateDto)(subject_validation_1.SubjectValidation.createSubjectSchema, body);
            const subject = await subject_repository_1.SubjectRepository.createSubject(validateData);
            return subject;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to create new subject');
        }
    }
    static async getAllSubjectService() {
        try {
            return await subject_repository_1.SubjectRepository.findAll({});
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to get all subjects');
        }
    }
    static async getSubjectsByClassIdService(user) {
        try {
            console.log(user);
            const validateData = (0, validateData_1.validateDto)(subject_validation_1.SubjectValidation.getSubjectsByClassIdSchema, { classId: user === null || user === void 0 ? void 0 : user.classId });
            const subjects = await subject_repository_1.SubjectRepository.findAll({ classId: validateData.classId });
            return subjects;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to get subjects by class');
        }
    }
}
exports.SubjectService = SubjectService;
