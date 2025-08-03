"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermRepository = void 0;
const prisma_1 = __importDefault(require("../../../core/lib/prisma"));
class TermRepository {
}
exports.TermRepository = TermRepository;
_a = TermRepository;
TermRepository.createTerm = async ({ name, code, classId, description }) => {
    const newTerm = await prisma_1.default.term.create({
        data: {
            name,
            code,
            classId,
            description,
        }
    });
    return newTerm;
};
TermRepository.findUniqueTermByCode = async ({ code }) => {
    const findUniqueTerm = await prisma_1.default.term.findUnique({
        where: {
            code,
        }
    });
    return findUniqueTerm;
};
TermRepository.findAll = async (classId) => {
    const findAllTerms = await prisma_1.default.term.findMany({
        where: Object.assign({}, (classId && { classId })),
        include: {
            class: true,
            _count: {
                select: {
                    chapters: true,
                }
            }
        }
    });
    return findAllTerms;
};
TermRepository.getTermByStudentClassId = async (classId) => {
    const getTermByClassId = await prisma_1.default.term.findMany({
        where: {
            classId
        },
        select: {
            id: true,
            name: true,
        }
    });
    return getTermByClassId;
};
