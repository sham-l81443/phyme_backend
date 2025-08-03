"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syllabusRouter = void 0;
const authenticateAdmin_1 = require("@/core/middleware/auth/authenticateAdmin");
const express_1 = __importDefault(require("express"));
const syllabus_controller_1 = require("./syllabus.controller");
const syllabusRouter = express_1.default.Router();
exports.syllabusRouter = syllabusRouter;
syllabusRouter.post('/admin/syllabus/create', authenticateAdmin_1.authenticateAdmin, syllabus_controller_1.SyllabusController.createSyllabus);
syllabusRouter.get('/syllabus/all', syllabus_controller_1.SyllabusController.getAllSyllabus);
