import express from "express";
import { authenticateAdmin } from "@/core/middleware/auth/authenticateAdmin";
import { SubjectController } from "./subject.controller";

const subjectRouter = express.Router();

subjectRouter.post('/subject/create',authenticateAdmin,SubjectController.createSubjectController)
subjectRouter.get('/subject/all',authenticateAdmin,SubjectController.getAllSubjectController)



export default subjectRouter