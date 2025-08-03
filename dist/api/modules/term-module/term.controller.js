"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermController = void 0;
const term_service_1 = require("./term.service");
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
class TermController {
    static async createTermController(req, res, next) {
        try {
            const newTerm = await term_service_1.TermService.createTermService(req.body);
            const responseData = (0, responseCreator_1.default)({ data: newTerm, message: 'Term created successfully' });
            res.status(201).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllTermController(req, res, next) {
        try {
            const allTerms = await term_service_1.TermService.getAllTermService();
            const responseData = (0, responseCreator_1.default)({ data: allTerms, message: 'All terms fetched successfully' });
            res.status(200).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
    static async getTermByClassId(req, res, next) {
        try {
            const { classId } = req.user;
            const allTerms = await term_service_1.TermService.getAllTermService(classId);
            const responseData = (0, responseCreator_1.default)({ data: allTerms, message: 'All terms fetched successfully' });
            res.status(200).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TermController = TermController;
