import express from "express";
import { ChapterController } from "./chapter.controller";

const ChapterRouter = express.Router();

ChapterRouter.get('/chapter/all',ChapterController.getAllChapters)
ChapterRouter.post('/chapter/create',ChapterController.createChapterController)

export default ChapterRouter