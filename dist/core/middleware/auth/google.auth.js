"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googlePassportAuth = void 0;
const passport_1 = __importDefault(require("passport"));
const googlePassportAuth = (req, res, next) => {
    const flow = req.query.flow === 'register' ? 'register' : 'login';
    passport_1.default.authenticate('google', {
        failureRedirect: '/login',
        session: false,
        scope: ['profile', 'email'],
        state: flow,
    })(req, res, next);
};
exports.googlePassportAuth = googlePassportAuth;
