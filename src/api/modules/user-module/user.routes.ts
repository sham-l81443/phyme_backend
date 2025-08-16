import express from "express";
import { UserController } from "./user.controller";
import { authenticateStudent } from "../../../core/middleware/auth/authenticateStudent";
import { authenticateAdmin } from "../../../core/middleware/auth/authenticateAdmin";

const userRouter = express.Router();

userRouter.get('/profile',authenticateStudent,UserController.getUserByIdController)
userRouter.get('/admin/profile',authenticateAdmin,UserController.getUserByIdController)
userRouter.get('/users/all',authenticateAdmin,UserController.getAllUserController)
userRouter.post('/logout',authenticateStudent,UserController.logoutController)
userRouter.post('/logout/admin',authenticateAdmin,UserController.logoutController)

export default userRouter
