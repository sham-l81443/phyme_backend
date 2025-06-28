import express from "express";
import { authenticateAdmin } from "@/core/middleware/auth/authenticateAdmin";
import { ClassController } from "./class.controller";

const classRouter = express.Router();

classRouter.post('/class/create',authenticateAdmin,ClassController.createClassController)

classRouter.get('/class/all',ClassController.getAllClassController)

export default classRouter