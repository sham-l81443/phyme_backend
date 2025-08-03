"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const constants_1 = require("./constants");
const create_class_controller_1 = __importDefault(require("../controllers/admin-controllers/class/create.class.controller"));
const get_class_controller_1 = __importDefault(require("../controllers/admin-controllers/class/get.class.controller"));
const authenticateAdmin_1 = require("../../core/middleware/auth/authenticateAdmin");
const router = (0, express_1.Router)();
router.post(constants_1.ADMIN_ENDPOINTS.createClass, authenticateAdmin_1.authenticateAdmin, create_class_controller_1.default);
router.get(constants_1.ADMIN_ENDPOINTS.getClass, authenticateAdmin_1.authenticateAdmin, get_class_controller_1.default);
exports.default = router;
