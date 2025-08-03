"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const googleConfig = () => {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
        passReqToCallback: true
    }, async (request, accessToken, refreshToken, profile, done) => {
        var _a, _b;
        console.log(profile);
        try {
            console.log('Authentication successful', {
                profile: profile.id,
                email: (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value
            });
            return done(null, profile);
        }
        catch (error) {
            return done(error, false);
        }
    }));
};
exports.default = googleConfig;
