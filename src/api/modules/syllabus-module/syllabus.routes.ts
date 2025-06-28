import { authenticateAdmin } from "@/core/middleware/auth/authenticateAdmin";
import express from "express";
import { SyllabusController } from "./syllabus.controller";

const syllabusRouter = express.Router();

// admin

syllabusRouter.post('/admin/syllabus/create',authenticateAdmin,SyllabusController.createSyllabus)


// global
syllabusRouter.get('/syllabus/all',SyllabusController.getAllSyllabus)



export  { syllabusRouter } 