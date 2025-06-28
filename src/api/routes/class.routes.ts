import { Router } from "express";
import { ADMIN_ENDPOINTS } from "./constants";
import createClassController from "../controllers/admin-controllers/class/create.class.controller";
import getClassController from "../controllers/admin-controllers/class/get.class.controller";
import { authenticateAdmin } from "../../core/middleware/auth/authenticateAdmin";

const router = Router()

router.post(ADMIN_ENDPOINTS.createClass, authenticateAdmin, createClassController)
router.get(ADMIN_ENDPOINTS.getClass, authenticateAdmin, getClassController)

export default router