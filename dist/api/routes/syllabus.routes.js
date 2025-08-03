"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const create_syllabus_controller_1 = __importDefault(require("../controllers/admin-controllers/syllabus/create.syllabus.controller"));
const get_syllabus_controller_1 = __importDefault(require("../controllers/admin-controllers/syllabus/get.syllabus.controller"));
const router = (0, express_1.Router)();
router.post('/create', create_syllabus_controller_1.default);
router.get('/list', get_syllabus_controller_1.default);
exports.default = router;
