"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterController = void 0;
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const chapter_service_1 = require("./chapter.service");
class ChapterController {
    static async getAllChapters(req, res, next) {
        try {
            const allChapters = await chapter_service_1.ChapterService.findAll();
            const responseData = (0, responseCreator_1.default)({ data: allChapters, message: 'Chapters fetched successfully' });
            res.status(200).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
    static async createChapterController(req, res, next) {
        try {
            const newChapter = await chapter_service_1.ChapterService.createChapterService(req.body);
            const responseData = (0, responseCreator_1.default)({ data: newChapter, message: 'Chapter created successfully' });
            res.status(201).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
    static async getChapterByTermIdAndSubjectId(req, res, next) {
        try {
            console.log(req.query);
            const chapter = await chapter_service_1.ChapterService.findByTermIdAndSubjectId(req.query);
            const responseData = (0, responseCreator_1.default)({ data: chapter, message: 'Chapter fetched successfully' });
            res.status(200).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ChapterController = ChapterController;
