import express from "express";
import { UserController } from "./user.controller";
import { authenticateStudent } from "../../../core/middleware/auth/authenticateStudent";
import { authenticateAdmin } from "../../../core/middleware/auth/authenticateAdmin";

const userRouter = express.Router();

userRouter.get('/profile',authenticateStudent,UserController.getUserByIdController)
userRouter.get('/admin/profile',authenticateAdmin,UserController.getUserByIdController)
userRouter.get('/users/all',authenticateAdmin,UserController.getAllUserController)

// logout for student
userRouter.post('/logout',authenticateStudent,UserController.logoutController)

// logout for admin
userRouter.post('/logout/admin',authenticateAdmin,UserController.logoutController)

// student details by id for admin dashboard
userRouter.get('/student/details',authenticateAdmin,UserController.getStudentDetailsByIdController)

export default userRouter
