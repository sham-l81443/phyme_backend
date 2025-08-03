"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createChapterController_1 = __importDefault(require("../controllers/admin-controllers/chapter/createChapterController"));
const authenticateAdmin_1 = require("@/core/middleware/auth/authenticateAdmin");
const deleteChapterController_1 = __importDefault(require("@/api/controllers/admin-controllers/chapter/deleteChapterController"));
const getChapterController_1 = __importDefault(require("@/api/controllers/admin-controllers/chapter/getChapterController"));
const router = express_1.default.Router();
router.post('/create', authenticateAdmin_1.authenticateAdmin, createChapterController_1.default);
router.delete('/delete', authenticateAdmin_1.authenticateAdmin, deleteChapterController_1.default);
router.get('/list', authenticateAdmin_1.authenticateAdmin, getChapterController_1.default);
exports.default = router;
