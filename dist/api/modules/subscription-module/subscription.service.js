"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const rethrowError_1 = require("../../../core/utils/errors/rethrowError");
const subscription_repository_1 = require("./subscription.repository");
const validateData_1 = require("../../../core/utils/dto/validateData");
const subscription_validation_1 = require("./subscription.validation");
class SubscriptionService {
    static async createSubscriptionService(body) {
        try {
            const validateData = (0, validateData_1.validateDto)(subscription_validation_1.SubscriptionValidation.createSubscriptionSchema, body);
            const subscription = await subscription_repository_1.SubscriptionRepository.createSubscription(validateData);
            return subscription;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to create new subscription');
        }
    }
    static async getUserSubscriptionService(userId) {
        try {
            const subscription = await subscription_repository_1.SubscriptionRepository.getUserSubscription(userId);
            return subscription;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to get user subscription');
        }
    }
}
exports.SubscriptionService = SubscriptionService;
