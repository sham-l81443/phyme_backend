"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const constants_1 = require("./constants");
const authenticateStudent_1 = require("../../core/middleware/auth/authenticateStudent");
const student_details_controller_1 = __importDefault(require("../controllers/auth/student/student.details.controller"));
const profileRouter = (0, express_1.Router)();
profileRouter.get(constants_1.STUDENT_ENDPOINTS.details, authenticateStudent_1.authenticateStudent, student_details_controller_1.default);
exports.default = profileRouter;
