"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const term_controller_1 = require("./term.controller");
const authenticateAdmin_1 = require("@/core/middleware/auth/authenticateAdmin");
const authenticateStudent_1 = require("@/core/middleware/auth/authenticateStudent");
const termRouter = express_1.default.Router();
termRouter.post('/term/create', authenticateAdmin_1.authenticateAdmin, term_controller_1.TermController.createTermController);
termRouter.get('/term/all', authenticateAdmin_1.authenticateAdmin, term_controller_1.TermController.getAllTermController);
termRouter.get('/student/get-all-terms-by-class', authenticateStudent_1.authenticateStudent, term_controller_1.TermController.getTermByClassId);
exports.default = termRouter;
