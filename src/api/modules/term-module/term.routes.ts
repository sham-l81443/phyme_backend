import express from "express";
import { TermController } from "./term.controller";
import { authenticateAdmin } from "../../../core/middleware/auth/authenticateAdmin";
import { authenticateStudent } from "../../../core/middleware/auth/authenticateStudent";

const termRouter = express.Router();


termRouter.post('/term/create',authenticateAdmin,TermController.createTermController)
termRouter.get('/term/all',authenticateAdmin,TermController.getAllTermController)
termRouter.get('/student/get-all-terms-by-class',authenticateStudent,TermController.getTermByClassId)


export default termRouter