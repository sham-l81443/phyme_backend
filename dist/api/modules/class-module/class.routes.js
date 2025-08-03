"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateAdmin_1 = require("../../../core/middleware/auth/authenticateAdmin");
const class_controller_1 = require("./class.controller");
const classRouter = express_1.default.Router();
classRouter.post('/class/create', authenticateAdmin_1.authenticateAdmin, class_controller_1.ClassController.createClassController);
classRouter.get('/class/all', class_controller_1.ClassController.getAllClassController);
classRouter.get('/class/syllabus/:syllabusId', class_controller_1.ClassController.getClassBySyllabusController);
exports.default = classRouter;
