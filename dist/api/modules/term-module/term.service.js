"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermService = void 0;
const utils_1 = require("../../../core/utils");
const rethrowError_1 = require("../../../core/utils/errors/rethrowError");
const term_validation_1 = require("./term.validation");
const term_repository_1 = require("./term.repository");
const AppError_1 = require("../../../core/utils/errors/AppError");
class TermService {
    static async createTermService(body) {
        try {
            const validateData = (0, utils_1.validateDto)(term_validation_1.TermValidation.createTermSchema, body);
            const existingTerm = await term_repository_1.TermRepository.findUniqueTermByCode({ code: validateData.code });
            if (existingTerm) {
                throw new AppError_1.AppError({ errorType: 'Bad Request', message: 'Term already exists' });
            }
            const newTerm = await term_repository_1.TermRepository.createTerm(validateData);
            return newTerm;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to create new term');
        }
    }
    static async getAllTermService(classId) {
        try {
            return await term_repository_1.TermRepository.getTermByStudentClassId(classId);
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to get all terms');
        }
    }
}
exports.TermService = TermService;
