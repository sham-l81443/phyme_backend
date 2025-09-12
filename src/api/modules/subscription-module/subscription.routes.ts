import express from "express";
import { SubscriptionController } from "./subscription.controller";
import { authenticateAdmin } from "../../../core/middleware/auth/authenticateAdmin";
import { authenticateStudent } from "../../../core/middleware/auth/authenticateStudent";

const subscriptionRouter = express.Router();

// Admin routes for managing subscriptions
subscriptionRouter.post('/student/subscription/create', authenticateAdmin, SubscriptionController.createSubscriptionController)
subscriptionRouter.delete('/student/subscription/remove', authenticateAdmin, SubscriptionController.removeSubscriptionController)

// Student routes for viewing their subscriptions
subscriptionRouter.get('/student/subscriptions', authenticateStudent, SubscriptionController.getUserSubscriptionController)

export default subscriptionRouter