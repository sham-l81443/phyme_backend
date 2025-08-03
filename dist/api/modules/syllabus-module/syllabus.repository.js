"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyllabusRepository = void 0;
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
class SyllabusRepository {
    static async create(data) {
        return await prisma_1.default.syllabus.create({
            data,
            include: {
                _count: {
                    select: {
                        classes: true,
                        users: true,
                    }
                }
            }
        });
    }
    static async findByCode(code, excludeId = null) {
        const whereClause = {
            code,
        };
        if (excludeId) {
            whereClause.id = { not: excludeId };
        }
        return await prisma_1.default.syllabus.findFirst({
            where: whereClause
        });
    }
    static async findAll() {
        return await prisma_1.default.syllabus.findMany({
            include: {
                _count: {
                    select: {
                        classes: true,
                        users: true,
                    }
                }
            }
        });
    }
}
exports.SyllabusRepository = SyllabusRepository;
