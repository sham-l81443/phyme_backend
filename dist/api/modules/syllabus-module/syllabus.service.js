"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyllabusService = void 0;
const rethrowError_1 = require("../../../core/utils/errors/rethrowError");
const syllabus_validation_1 = require("./syllabus.validation");
const AppError_1 = require("../../../core/utils/errors/AppError");
const utils_1 = require("../../../core/utils");
const syllabus_repository_1 = require("./syllabus.repository");
class SyllabusService {
    static async createSyllabusService(body) {
        console.log(body);
        try {
            const validatedData = (0, utils_1.validateDto)(syllabus_validation_1.SyllabusValidation.createSyllabusSchema, body);
            console.log(validatedData);
            const existingSyllabus = await syllabus_repository_1.SyllabusRepository.findByCode(validatedData.code);
            if (existingSyllabus) {
                throw new AppError_1.AppError({ errorType: "Conflict", message: "Syllabus with this code already exists" });
            }
            return await syllabus_repository_1.SyllabusRepository.create(validatedData);
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to create new syllabus');
        }
    }
    static async getAllSyllabusService() {
        try {
            return await syllabus_repository_1.SyllabusRepository.findAll();
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to get all syllabus');
        }
    }
}
exports.SyllabusService = SyllabusService;
