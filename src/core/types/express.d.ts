import { User, StudentSubscription } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      userSubscriptions?: Pick<StudentSubscription, 'id' | 'termId' | 'createdAt'>[];
    }
  }
}
