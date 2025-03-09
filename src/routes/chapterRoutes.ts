
import express from "express"
import createChapterController from "../controllers/admin-controllers/chapter-controller/createChapterController"
import { authenticateAdmin } from "@/middleware/authenticateAdmin"
import deleteChapterController from "@/controllers/admin-controllers/chapter-controller/deleteChapterController"
import getChaptersController from "@/controllers/admin-controllers/chapter-controller/getChapterController"

const router = express.Router()

router.post('/create', authenticateAdmin, createChapterController)
router.delete('/delete', authenticateAdmin, deleteChapterController)
router.get('/list', authenticateAdmin, getChaptersController)



export default router
