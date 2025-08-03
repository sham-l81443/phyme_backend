"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateAdmin_1 = require("../../../core/middleware/auth/authenticateAdmin");
const subject_controller_1 = require("./subject.controller");
const authenticateStudent_1 = require("../../../core/middleware/auth/authenticateStudent");
const subjectRouter = express_1.default.Router();
subjectRouter.post('/subject/create', authenticateAdmin_1.authenticateAdmin, subject_controller_1.SubjectController.createSubjectController);
subjectRouter.get('/subject/all', authenticateAdmin_1.authenticateAdmin, subject_controller_1.SubjectController.getAllSubjectController);
subjectRouter.get('/student/subject/all', authenticateStudent_1.authenticateStudent, subject_controller_1.SubjectController.getAllSubjectController);
subjectRouter.get('/student/class/subject', authenticateStudent_1.authenticateStudent, subject_controller_1.SubjectController.getSubjectsByClassIdController);
exports.default = subjectRouter;
