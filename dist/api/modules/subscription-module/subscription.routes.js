"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscription_controller_1 = require("./subscription.controller");
const subscriptionRouter = express_1.default.Router();
subscriptionRouter.post('/create', subscription_controller_1.SubscriptionController.createSubscriptionController);
subscriptionRouter.get('/student/subscriptions', subscription_controller_1.SubscriptionController.getUserSubscriptionController);
exports.default = subscriptionRouter;
