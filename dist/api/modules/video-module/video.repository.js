"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRepository = void 0;
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
class VideoRepository {
}
exports.VideoRepository = VideoRepository;
_a = VideoRepository;
VideoRepository.createVideo = async (data) => {
    return await prisma_1.default.video.create({
        data: {
            name: data.name,
            description: data.description,
            embedLink: data.embedLink,
            duration: data.duration,
            code: data.code,
            thumbnail: data.thumbnail,
            lessonId: data.lessonId,
            isFree: true
        },
    });
};
VideoRepository.getAllVideos = async () => {
    return await prisma_1.default.video.findMany({
        include: {
            lesson: {
                select: {
                    name: true,
                    chapter: {
                        select: {
                            name: true,
                        }
                    }
                }
            }
        }
    });
};
VideoRepository.getAllVideosByLessonId = async (lessonId) => {
    return await prisma_1.default.video.findMany({
        where: {
            lessonId: lessonId
        },
        omit: {
            embedLink: true
        }
    });
};
VideoRepository.getVideoById = async (id) => {
    return await prisma_1.default.video.findUnique({
        where: {
            id: id
        },
        select: {
            embedLink: true
        }
    });
};
