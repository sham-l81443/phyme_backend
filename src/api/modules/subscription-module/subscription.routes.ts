import express from "express";
import { SubscriptionController } from "./subscription.controller";
import { authenticateAdmin } from "../../../core/middleware/auth/authenticateAdmin";

const subscriptionRouter = express.Router();


subscriptionRouter.post('/student/subscription/create',authenticateAdmin,SubscriptionController.createSubscriptionController)
subscriptionRouter.get('/student/subscriptions',SubscriptionController.getUserSubscriptionController)
subscriptionRouter.delete('/student/subscription/remove',authenticateAdmin,SubscriptionController.removeSubscriptionController)

export default subscriptionRouter