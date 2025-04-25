
import express from "express"
import createChapterController from "../controllers/admin-controllers/chapter-controller/createChapterController"
import { authenticateAdmin } from "@/api/middleware/auth/authenticateAdmin"
import deleteChapterController from "@/api/controllers/admin-controllers/chapter-controller/deleteChapterController"
import getChaptersController from "@/api/controllers/admin-controllers/chapter-controller/getChapterController"

const router = express.Router()

router.post('/create', authenticateAdmin, createChapterController)
router.delete('/delete', authenticateAdmin, deleteChapterController)
router.get('/list', authenticateAdmin, getChaptersController)



export default router
