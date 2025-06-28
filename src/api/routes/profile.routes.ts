import { Router } from "express"
import { STUDENT_ENDPOINTS } from "./constants"
import { authenticateStudent } from "../../core/middleware/auth/authenticateStudent"
import studentDetailsController from "../controllers/auth/student/student.details.controller"

const profileRouter = Router()

profileRouter.get(STUDENT_ENDPOINTS.details, authenticateStudent, studentDetailsController)


export default profileRouter