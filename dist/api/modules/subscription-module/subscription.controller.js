"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const subscription_service_1 = require("./subscription.service");
const responseCreator_1 = __importDefault(require("../../../core/utils/responseCreator"));
class SubscriptionController {
    static async createSubscriptionController(req, res, next) {
        try {
            const newSubscription = await subscription_service_1.SubscriptionService.createSubscriptionService(req.body);
            const responseData = (0, responseCreator_1.default)({ data: newSubscription, message: 'Subscription created successfully' });
            res.status(201).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserSubscriptionController(req, res, next) {
        try {
            const user = req.user;
            const subscription = await subscription_service_1.SubscriptionService.getUserSubscriptionService(user === null || user === void 0 ? void 0 : user.id);
            const responseData = (0, responseCreator_1.default)({ data: subscription, message: 'Subscription fetched successfully' });
            res.status(200).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SubscriptionController = SubscriptionController;
