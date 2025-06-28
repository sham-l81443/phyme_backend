
import express from "express"
import createChapterController from "../controllers/admin-controllers/chapter/createChapterController"
import { authenticateAdmin } from "@/core/middleware/auth/authenticateAdmin"
import deleteChapterController from "@/api/controllers/admin-controllers/chapter/deleteChapterController"
import getChaptersController from "@/api/controllers/admin-controllers/chapter/getChapterController"

const router = express.Router()

router.post('/create', authenticateAdmin, createChapterController)
router.delete('/delete', authenticateAdmin, deleteChapterController)
router.get('/list', authenticateAdmin, getChaptersController)



export default router
