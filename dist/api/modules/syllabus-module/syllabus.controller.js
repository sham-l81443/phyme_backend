"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyllabusController = void 0;
const syllabus_service_1 = require("./syllabus.service");
const responseCreator_1 = __importDefault(require("../../../core/utils/responseCreator"));
class SyllabusController {
    static async createSyllabus(req, res, next) {
        try {
            const newSyllabus = await syllabus_service_1.SyllabusService.createSyllabusService(req === null || req === void 0 ? void 0 : req.body);
            const responseData = (0, responseCreator_1.default)({ data: newSyllabus, message: 'Syllabus created successfully' });
            res.status(201).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllSyllabus(req, res, next) {
        try {
            const allSyllabus = await syllabus_service_1.SyllabusService.getAllSyllabusService();
            const responseData = (0, responseCreator_1.default)({ data: allSyllabus, message: 'All syllabus fetched successfully' });
            res.status(200).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SyllabusController = SyllabusController;
