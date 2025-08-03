"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassController = void 0;
const responseCreator_1 = __importDefault(require("../../../core/utils/responseCreator"));
const class_service_1 = require("./class.service");
class ClassController {
    static async createClassController(req, res, next) {
        try {
            const newClass = await class_service_1.ClassService.createClassService({ body: req.body });
            const responseData = (0, responseCreator_1.default)({ data: newClass, message: 'Class created successfully' });
            res.status(201).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllClassController(req, res, next) {
        try {
            const allClasses = await class_service_1.ClassService.getAllClassService();
            const responseData = (0, responseCreator_1.default)({ data: allClasses, message: 'All classes fetched successfully' });
            res.status(200).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
    static async getClassBySyllabusController(req, res, next) {
        try {
            const classes = await class_service_1.ClassService.getClassBySyllabusService({ body: req.params });
            const responseData = (0, responseCreator_1.default)({ data: classes, message: 'Classes fetched successfully' });
            res.status(200).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ClassController = ClassController;
