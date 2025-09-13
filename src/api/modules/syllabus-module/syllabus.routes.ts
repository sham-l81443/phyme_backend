import { authenticateAdmin } from "../../../core/middleware/auth/authenticateAdmin";
import express from "express";
import { SyllabusController } from "./syllabus.controller";

const syllabusRouter = express.Router();

// admin

syllabusRouter.post('/admin/syllabus/create',authenticateAdmin,SyllabusController.createSyllabus)
syllabusRouter.put('/admin/syllabus/:id',authenticateAdmin,SyllabusController.updateSyllabus)
syllabusRouter.delete('/admin/syllabus/:id',authenticateAdmin,SyllabusController.deleteSyllabus)


// global
syllabusRouter.get('/syllabus/all',SyllabusController.getAllSyllabus)



export  { syllabusRouter } 