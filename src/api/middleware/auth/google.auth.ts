import { NextFunction, Response, Request } from "express";
import passport from "passport";

export const googlePassportAuth = (req: Request, res: Response, next: NextFunction) => {
    const flow = req.query.flow === 'register' ? 'register' : 'login';

    passport.authenticate('google', {
        failureRedirect: '/login',
        session: false,
        scope: ['profile', 'email'],
        state: flow,
    })(req, res, next);
};