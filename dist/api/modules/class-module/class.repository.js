"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassRepository = void 0;
const prisma_1 = __importDefault(require("../../../core/lib/prisma"));
class ClassRepository {
}
exports.ClassRepository = ClassRepository;
_a = ClassRepository;
ClassRepository.createClass = async ({ name, code, syllabusId, description, isActive }) => {
    const newClass = await prisma_1.default.class.create({
        data: {
            name,
            code,
            syllabusId,
            description,
        }
    });
    return newClass;
};
ClassRepository.findUniqueClassByCode = async ({ code }) => {
    const findUniqueClass = await prisma_1.default.class.findUnique({
        where: {
            code,
        }
    });
    return findUniqueClass;
};
ClassRepository.findAll = async () => {
    return await prisma_1.default.class.findMany({
        include: {
            syllabus: {
                select: {
                    name: true
                }
            },
            _count: {
                select: {
                    subjects: true,
                    users: true,
                    terms: true
                }
            }
        }
    });
};
ClassRepository.getClassesBySyllabusId = async ({ syllabusId }) => {
    return await prisma_1.default.class.findMany({
        where: {
            syllabusId
        }
    });
};
