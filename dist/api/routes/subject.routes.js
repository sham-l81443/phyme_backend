"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const create_subject_1 = __importDefault(require("../controllers/admin-controllers/subject/create-subject"));
const constants_1 = require("./constants");
const router = express_1.default.Router();
router.post(constants_1.ADMIN_ENDPOINTS.createSubject, create_subject_1.default);
exports.default = router;
