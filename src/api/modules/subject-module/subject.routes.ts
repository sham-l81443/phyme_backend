import express from "express";
import { authenticateAdmin } from "../../../core/middleware/auth/authenticateAdmin";
import { SubjectController } from "./subject.controller";
import { authenticateStudent } from "../../../core/middleware/auth/authenticateStudent";

const subjectRouter = express.Router();

subjectRouter.post('/subject/create',authenticateAdmin,SubjectController.createSubjectController)
subjectRouter.get('/subject/all',authenticateAdmin,SubjectController.getAllSubjectController)

//student
subjectRouter.get('/student/subject/all',authenticateStudent,SubjectController.getAllSubjectController)
subjectRouter.get('/student/class/subject',authenticateStudent,SubjectController.getSubjectsByClassIdController)



export default subjectRouter