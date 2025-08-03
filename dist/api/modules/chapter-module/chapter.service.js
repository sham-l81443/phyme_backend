"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterService = void 0;
const utils_1 = require("@/core/utils");
const rethrowError_1 = require("@/core/utils/errors/rethrowError");
const chapter_repository_1 = require("./chapter.repository");
const chapter_validation_1 = require("./chapter.validation");
class ChapterService {
    static async createChapterService(body) {
        try {
            const validateData = (0, utils_1.validateDto)(chapter_validation_1.ChapterValidation.createChapterSchema, body);
            const chapter = await chapter_repository_1.ChapterRepository.createChapter(validateData);
            return chapter;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to create new folder');
        }
    }
    static async findAll() {
        try {
            const allChapters = await chapter_repository_1.ChapterRepository.findAll();
            return allChapters;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to fetch all chapters');
        }
    }
    static async findByTermIdAndSubjectId(params) {
        try {
            const validateData = (0, utils_1.validateDto)(chapter_validation_1.ChapterValidation.findByTermIdAndSubjectIdSchema, params);
            const { subjectId, termId } = validateData;
            const chapter = await chapter_repository_1.ChapterRepository.findChapterBySubjectIdAndTermId({
                subjectId,
                termId: termId
            });
            return chapter;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to fetch chapter');
        }
    }
}
exports.ChapterService = ChapterService;
