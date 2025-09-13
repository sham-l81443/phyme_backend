import express from "express";
import { authenticateAdmin } from "../../../core/middleware/auth/authenticateAdmin";
import { ClassController } from "./class.controller";

const classRouter = express.Router();

classRouter.post('/class/create',authenticateAdmin,ClassController.createClassController)
classRouter.put('/class/:id',authenticateAdmin,ClassController.updateClassController)
classRouter.delete('/class/:id',authenticateAdmin,ClassController.deleteClassController)

classRouter.get('/class/all',ClassController.getAllClassController)

classRouter.get('/class/syllabus/:syllabusId',ClassController.getClassBySyllabusController)

export default classRouter