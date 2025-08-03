"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const authRouter = express_1.default.Router();
authRouter.post('/login', auth_controller_1.AuthController.studentLoginController);
authRouter.post('/register', auth_controller_1.AuthController.studentRegisterController);
authRouter.post('/verify', auth_controller_1.AuthController.verifyStudentController);
authRouter.post('/reset', auth_controller_1.AuthController.resetStudentPassword);
authRouter.post('/getResetPasswordOtp', auth_controller_1.AuthController.getRestPasswordOtp);
authRouter.post('/admin/login', auth_controller_1.AuthController.adminLoginController);
exports.default = authRouter;
