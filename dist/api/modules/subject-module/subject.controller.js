"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectController = void 0;
const subject_service_1 = require("./subject.service");
const responseCreator_1 = __importDefault(require("../../../core/utils/responseCreator"));
class SubjectController {
    static async createSubjectController(req, res, next) {
        try {
            const subject = await subject_service_1.SubjectService.createSubjectService(req.body);
            const responseData = (0, responseCreator_1.default)({ data: subject, message: 'Subject created successfully' });
            res.status(201).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllSubjectController(req, res, next) {
        try {
            const subjects = await subject_service_1.SubjectService.getAllSubjectService();
            const responseData = (0, responseCreator_1.default)({ data: subjects, message: 'Subjects fetched successfully' });
            res.status(200).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
    static async getSubjectsByClassIdController(req, res, next) {
        try {
            const subjects = await subject_service_1.SubjectService.getSubjectsByClassIdService(req.user);
            const responseData = (0, responseCreator_1.default)({ data: subjects, message: 'Subjects fetched successfully' });
            res.status(200).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SubjectController = SubjectController;
