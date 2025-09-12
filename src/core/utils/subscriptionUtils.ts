import prisma from "../lib/prisma";
import { AppError } from "./errors/AppError";

export class SubscriptionUtils {
  /**
   * Check if a user has active subscription for a specific term
   */
  static async hasActiveSubscription(studentId: string, termId: string): Promise<boolean> {
    try {
      const subscription = await prisma.studentSubscription.findFirst({
        where: {
          studentId,
          termId,
          isActive: true
        }
      });
      return !!subscription;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  }

  /**
   * Get all active subscriptions for a user
   */
  static async getActiveSubscriptions(studentId: string) {
    try {
      return await prisma.studentSubscription.findMany({
        where: {
          studentId,
          isActive: true
        },
        include: {
          term: {
            select: {
              id: true,
              name: true,
              code: true,
              description: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error getting active subscriptions:', error);
      throw new AppError({
        errorType: 'Internal Server Error',
        message: 'Failed to retrieve subscription information'
      });
    }
  }

  /**
   * Check if user has any active subscription
   */
  static async hasAnyActiveSubscription(studentId: string): Promise<boolean> {
    try {
      const count = await prisma.studentSubscription.count({
        where: {
          studentId,
          isActive: true
        }
      });
      return count > 0;
    } catch (error) {
      console.error('Error checking active subscriptions:', error);
      return false;
    }
  }

  /**
   * Get subscription status for multiple terms
   */
  static async getSubscriptionStatusForTerms(studentId: string, termIds: string[]) {
    try {
      const subscriptions = await prisma.studentSubscription.findMany({
        where: {
          studentId,
          termId: { in: termIds },
          isActive: true
        },
        select: { termId: true }
      });

      const subscribedTermIds = new Set(subscriptions.map(sub => sub.termId));
      
      return termIds.map(termId => ({
        termId,
        isSubscribed: subscribedTermIds.has(termId)
      }));
    } catch (error) {
      console.error('Error getting subscription status for terms:', error);
      throw new AppError({
        errorType: 'Internal Server Error',
        message: 'Failed to retrieve subscription status'
      });
    }
  }

  /**
   * Validate subscription data before creation
   */
  static validateSubscriptionData(data: any) {
    const errors: string[] = [];

    if (!data.studentId) {
      errors.push('Student ID is required');
    }

    if (!data.termId) {
      errors.push('Term ID is required');
    }

    if (errors.length > 0) {
      throw new AppError({
        errorType: 'Bad Request',
        message: 'Invalid subscription data',
        data: { errors }
      });
    }

    return true;
  }

  /**
   * Create or activate subscription
   */
  static async createOrActivateSubscription(data: { studentId: string; termId: string }) {
    try {
      this.validateSubscriptionData(data);

      // Check if subscription already exists
      const existingSubscription = await prisma.studentSubscription.findUnique({
        where: {
          studentId_termId: {
            studentId: data.studentId,
            termId: data.termId
          }
        }
      });

      if (existingSubscription) {
        if (existingSubscription.isActive) {
          return existingSubscription; // Already active
        }

        // Reactivate existing subscription
        return await prisma.studentSubscription.update({
          where: { id: existingSubscription.id },
          data: { isActive: true },
          include: {
            term: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        });
      }

      // Create new subscription
      return await prisma.studentSubscription.create({
        data: {
          ...data,
          isActive: true
        },
        include: {
          term: {
            select: {
              id: true,
              name: true,
              code: true
            }
          }
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error creating/activating subscription:', error);
      throw new AppError({
        errorType: 'Internal Server Error',
        message: 'Failed to create subscription'
      });
    }
  }

  /**
   * Deactivate subscription
   */
  static async deactivateSubscription(subscriptionId: string, studentId: string) {
    try {
      const subscription = await prisma.studentSubscription.findFirst({
        where: {
          id: subscriptionId,
          studentId
        }
      });

      if (!subscription) {
        throw new AppError({
          errorType: 'Not Found',
          message: 'Subscription not found'
        });
      }

      return await prisma.studentSubscription.update({
        where: { id: subscriptionId },
        data: { isActive: false }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error deactivating subscription:', error);
      throw new AppError({
        errorType: 'Internal Server Error',
        message: 'Failed to deactivate subscription'
      });
    }
  }
}
