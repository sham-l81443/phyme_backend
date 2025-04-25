import { Router } from "express";
import { ADMIN_ENDPOINTS } from "./constants";
import createClassController from "../controllers/admin-controllers/class-controller/create.class.controller";
import getClassController from "../controllers/admin-controllers/class-controller/get.class.controller";

const router = Router()

router.post(ADMIN_ENDPOINTS.createClass, createClassController)
router.get(ADMIN_ENDPOINTS.getClass, getClassController)

export default router