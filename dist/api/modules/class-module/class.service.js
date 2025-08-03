"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassService = void 0;
const utils_1 = require("@/core/utils");
const class_validation_1 = require("./class.validation");
const class_repository_1 = require("./class.repository");
const rethrowError_1 = require("@/core/utils/errors/rethrowError");
const AppError_1 = require("@/core/utils/errors/AppError");
class ClassService {
    static async createClassService(body) {
        try {
            const validateData = (0, utils_1.validateDto)(class_validation_1.ClassValidation.createClassSchema, body.body);
            const existingClass = await class_repository_1.ClassRepository.findUniqueClassByCode({ code: validateData.code });
            if (existingClass) {
                throw new AppError_1.AppError({ errorType: 'Bad Request', message: 'Class already exists' });
            }
            const newClass = await class_repository_1.ClassRepository.createClass(validateData);
            return newClass;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to create new class');
        }
    }
    static async getAllClassService() {
        try {
            return await class_repository_1.ClassRepository.findAll();
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to get all classes');
        }
    }
    static async getClassBySyllabusService(body) {
        try {
            const validatedData = (0, utils_1.validateDto)(class_validation_1.ClassValidation.getClassBySyllabusSchema, body.body);
            return await class_repository_1.ClassRepository.getClassesBySyllabusId({ syllabusId: validatedData.syllabusId });
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to get classes by syllabus');
        }
    }
}
exports.ClassService = ClassService;
