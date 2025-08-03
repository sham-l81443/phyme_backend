import express from "express";
import { ChapterController } from "./chapter.controller";

const ChapterRouter = express.Router();

ChapterRouter.get('/chapter/all',ChapterController.getAllChapters)
ChapterRouter.post('/chapter/create',ChapterController.createChapterController)
ChapterRouter.get('/student/chapters',ChapterController.getChapterByTermIdAndSubjectId)

export default ChapterRouter