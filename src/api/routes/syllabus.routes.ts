import { Router } from "express";
import createSyllabusController from "../controllers/admin-controllers/syllabus/create.syllabus.controller";
import getSyllabusController from "../controllers/admin-controllers/syllabus/get.syllabus.controller";

const router = Router()


router.post('/create', createSyllabusController)

router.get('/list',getSyllabusController)

export default router