"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonRepository = void 0;
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
class LessonRepository {
    static async createLesson(data) {
        return await prisma_1.default.lesson.create({
            data: {
                name: data.name,
                code: data.code,
                chapterId: data.chapterId,
                description: data.description,
                isActive: true,
            },
        });
    }
    static async findAll() {
        return await prisma_1.default.lesson.findMany({
            include: {
                chapter: {
                    include: {
                        subject: true,
                        term: true,
                    },
                },
            },
        });
    }
    static async getLessonByChapterId(chapterId) {
        return await prisma_1.default.lesson.findMany({
            where: {
                chapterId: chapterId,
            },
            include: {
                _count: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
    }
}
exports.LessonRepository = LessonRepository;
