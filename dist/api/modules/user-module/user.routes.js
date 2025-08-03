"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const authenticateStudent_1 = require("@/core/middleware/auth/authenticateStudent");
const authenticateAdmin_1 = require("@/core/middleware/auth/authenticateAdmin");
const userRouter = express_1.default.Router();
userRouter.get('/profile', authenticateStudent_1.authenticateStudent, user_controller_1.UserController.getUserByIdController);
userRouter.get('/admin/profile', authenticateAdmin_1.authenticateAdmin, user_controller_1.UserController.getUserByIdController);
userRouter.get('/users/all', authenticateAdmin_1.authenticateAdmin, user_controller_1.UserController.getAllUserController);
exports.default = userRouter;
