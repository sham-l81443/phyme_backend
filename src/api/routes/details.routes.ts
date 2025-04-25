import { Router } from "express";
import studentDetailsController from "../controllers/auth/student/student.details.controller";
import { STUDENT_ENDPOINTS } from "./constants";
import { authenticateStudent } from "../middleware/auth/authenticateStudent";

const router = Router();

router.get(STUDENT_ENDPOINTS.details, authenticateStudent, studentDetailsController)

export default router;

