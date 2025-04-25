import { Router } from "express";
import { registerUser } from "@/api/controllers/auth/student/register.controller";
import { ADMIN_ENDPOINTS, STUDENT_ENDPOINTS } from "./constants";
import { verifyStudent } from "../controllers/auth/student/verify.student.controller";
import studentLogin from "../controllers/auth/student/student.login.controller";
import { googlePassportAuth } from "../middleware/auth/google.auth";
import googleAuthController from "../controllers/auth/student/google.auth.controller";
import adminLoginController from "../controllers/auth/admin/admin.login.controller";
import profileCompleteController from "../controllers/auth/student/profile.complete.controller";
import { authenticateStudent } from "../middleware/auth/authenticateStudent";
import getAllLiveClassUserController from "../controllers/student-controllers/tution/tution.videos.controller";





const router = Router();

//STUDENT ROUTES
router.post(STUDENT_ENDPOINTS.register, registerUser)
router.post(STUDENT_ENDPOINTS.verifyEmail, verifyStudent)
router.post(STUDENT_ENDPOINTS.login, studentLogin)
router.get(STUDENT_ENDPOINTS.googleAuth, googlePassportAuth, googleAuthController);
router.post(STUDENT_ENDPOINTS.profileComplete,authenticateStudent, profileCompleteController);


//ADMIN ROUTES
router.post(ADMIN_ENDPOINTS.login, adminLoginController)





export default router