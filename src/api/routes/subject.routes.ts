import express from "express"
import createSubjectController from "../controllers/admin-controllers/subject/create-subject"
import { authenticateAdmin } from "../../core/middleware/auth/authenticateAdmin"
import { ADMIN_ENDPOINTS } from "./constants"

const router = express.Router()

router.post(ADMIN_ENDPOINTS.createSubject, createSubjectController)

export default router


