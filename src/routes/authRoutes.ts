import { registerUser } from "../controllers/authController";
import { Router } from "express";


const router = Router();


router.post('/register', registerUser)

export default router