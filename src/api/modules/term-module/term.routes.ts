import express from "express";
import { TermController } from "./term.controller";
import { authenticateAdmin } from "@/core/middleware/auth/authenticateAdmin";

const termRouter = express.Router();


termRouter.post('/term/create',authenticateAdmin,TermController.createTermController)


export default termRouter