"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRepository = void 0;
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const rethrowError_1 = require("@/core/utils/errors/rethrowError");
class SubscriptionRepository {
    static async createSubscription(data) {
        try {
            const subscription = await prisma_1.default.studentSubscription.create({
                data
            });
            return subscription;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to create new subscription');
        }
    }
    static async getUserSubscription(userId) {
        try {
            const subscription = await prisma_1.default.studentSubscription.findMany({
                where: {
                    studentId: userId
                }
            });
            return subscription;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to get user subscription');
        }
    }
}
exports.SubscriptionRepository = SubscriptionRepository;
