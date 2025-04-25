import { Router } from "express";
import { STUDENT_ENDPOINTS } from "./constants";
import { authenticateStudent } from "../middleware/auth/authenticateStudent";
import getAllLiveClassUserController from "../controllers/student-controllers/tution/tution.videos.controller";

const videosRouter = Router()


videosRouter.get(STUDENT_ENDPOINTS.tutionVideos,authenticateStudent,getAllLiveClassUserController)


export default videosRouter
