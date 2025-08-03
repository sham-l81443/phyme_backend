"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const getSyllabusController = async (req, res, next) => {
    try {
        const syllabusList = await prisma_1.default.syllabus.findMany();
        const successObj = (0, responseCreator_1.default)({
            data: syllabusList,
        });
        res.status(200).json(successObj);
    }
    catch (e) {
        console.error("Error in get.syllabus.controller.ts:", e);
        next(e);
    }
};
exports.default = getSyllabusController;
