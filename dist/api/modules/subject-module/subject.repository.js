"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectRepository = void 0;
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
class SubjectRepository {
}
exports.SubjectRepository = SubjectRepository;
_a = SubjectRepository;
SubjectRepository.createSubject = async ({ name, code, classId, description }) => {
    const newSubject = await prisma_1.default.subject.create({
        data: {
            name,
            code,
            classId,
            description
        }
    });
    return newSubject;
};
SubjectRepository.findUniqueSubjectByCode = async ({ code }) => {
    const findUniqueSubject = await prisma_1.default.subject.findUnique({
        where: {
            code,
        }
    });
    return findUniqueSubject;
};
SubjectRepository.findAll = async ({ classId }) => {
    const findAllSubjects = await prisma_1.default.subject.findMany(Object.assign(Object.assign({}, (classId && {
        where: {
            classId
        }
    })), { include: {
            class: {
                include: {
                    syllabus: true
                }
            },
            _count: {
                select: {
                    chapters: true,
                }
            }
        } }));
    return findAllSubjects;
};
