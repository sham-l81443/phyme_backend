"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterRepository = void 0;
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
class ChapterRepository {
}
exports.ChapterRepository = ChapterRepository;
_a = ChapterRepository;
ChapterRepository.createChapter = async ({ name, code, termId, subjectId, description }) => {
    const newChapter = await prisma_1.default.chapter.create({
        data: {
            name,
            code,
            termId,
            description,
            subjectId,
            isActive: true
        }
    });
    return newChapter;
};
ChapterRepository.findAll = async () => {
    const findAllChapters = await prisma_1.default.chapter.findMany({
        include: {
            subject: true,
            term: true
        }
    });
    return findAllChapters;
};
ChapterRepository.findChapterBySubjectIdAndTermId = async ({ subjectId, termId }) => {
    const findChapterBySubjectId = await prisma_1.default.chapter.findMany({
        where: {
            subjectId,
            termId: {
                in: termId,
            },
            isActive: true
        },
        include: {
            _count: true
        },
        orderBy: {
            name: 'asc'
        }
    });
    return findChapterBySubjectId;
};
