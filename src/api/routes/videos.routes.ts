import { Router } from "express";
import { ADMIN_ENDPOINTS, STUDENT_ENDPOINTS } from "./constants";
import { authenticateStudent } from "../../core/middleware/auth/authenticateStudent";
import getAllLiveClassUserController from "../controllers/student-controllers/tution/tution.videos.controller";
import { authenticateAdmin } from "../../core/middleware/auth/authenticateAdmin";
import addLiveVideoController from "../controllers/admin-controllers/video/add.tution.video.controller";

const videosRouter = Router()


videosRouter.get(STUDENT_ENDPOINTS.tutionVideos,authenticateStudent,getAllLiveClassUserController)


//Admin
videosRouter.post(ADMIN_ENDPOINTS.createVideo,authenticateAdmin,addLiveVideoController)


export default videosRouter
