import express from "express";
import { AuthController } from "./auth.controller";

const authRouter = express.Router();


authRouter.post('/login', AuthController.studentLoginController);
authRouter.post('/register', AuthController.studentRegisterController);
authRouter.post('/verify', AuthController.verifyStudentController);
authRouter.post('/reset', AuthController.resetStudentPassword)
authRouter.post('/getResetPasswordOtp', AuthController.getRestPasswordOtp)
authRouter.post('/forget-password', AuthController.forgetPassword)


//admin
authRouter.post('/admin/login', AuthController.adminLoginController);

export default authRouter
