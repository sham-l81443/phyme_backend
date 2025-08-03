import express from "express";
import { SubscriptionController } from "./subscription.controller";

const subscriptionRouter = express.Router();


subscriptionRouter.post('/create',SubscriptionController.createSubscriptionController)
subscriptionRouter.get('/student/subscriptions',SubscriptionController.getUserSubscriptionController)

export default subscriptionRouter