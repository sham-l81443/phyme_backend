"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chapter_controller_1 = require("./chapter.controller");
const ChapterRouter = express_1.default.Router();
ChapterRouter.get('/chapter/all', chapter_controller_1.ChapterController.getAllChapters);
ChapterRouter.post('/chapter/create', chapter_controller_1.ChapterController.createChapterController);
ChapterRouter.get('/student/chapters', chapter_controller_1.ChapterController.getChapterByTermIdAndSubjectId);
exports.default = ChapterRouter;
