"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLoggedInCookie = exports.setAccessTokenCookie = exports.setRefreshTokenCookie = void 0;
const auth_1 = require("../../config/auth");
const user_1 = require("../../constants/ENUMS/user");
const setRefreshTokenCookie = ({ res, cookieValue, usageType }) => {
    const maxAge = usageType === user_1.UserRole.ADMIN ? auth_1.ADMIN_CONFIG.refreshTokenExpiry : auth_1.STUDENT_CONFIG.refreshTokenExpiry;
    const cookieKey = usageType === user_1.UserRole.ADMIN ? auth_1.ADMIN_CONFIG.ADMIN_REFRESH_TOKEN_KEY : auth_1.STUDENT_CONFIG.STUDENT_REFRESH_TOKEN_KEY;
    res.cookie(cookieKey, cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: maxAge,
        path: "/"
    });
};
exports.setRefreshTokenCookie = setRefreshTokenCookie;
const setAccessTokenCookie = ({ res, cookieValue, usageType }) => {
    const maxAge = usageType === user_1.UserRole.ADMIN ? auth_1.ADMIN_CONFIG.accessTokenExpiry : auth_1.STUDENT_CONFIG.accessTokenExpiry;
    const cookieKey = usageType === user_1.UserRole.ADMIN ? auth_1.ADMIN_CONFIG.ADMIN_ACCESS_TOKEN_KEY : auth_1.STUDENT_CONFIG.STUDENT_ACCESS_TOKEN_KEY;
    res.cookie(cookieKey, cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: maxAge,
        path: "/"
    });
};
exports.setAccessTokenCookie = setAccessTokenCookie;
const setLoggedInCookie = ({ res, cookieValue, usageType }) => {
    const maxAge = usageType === user_1.UserRole.ADMIN ? auth_1.ADMIN_CONFIG.refreshTokenExpiry : auth_1.STUDENT_CONFIG.refreshTokenExpiry;
    const cookieKey = usageType === user_1.UserRole.ADMIN ? auth_1.ADMIN_CONFIG.LOGGED_IN_KEY : auth_1.STUDENT_CONFIG.LOGGED_IN_KEY;
    res.cookie(cookieKey, cookieValue, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: maxAge,
        path: "/"
    });
};
exports.setLoggedInCookie = setLoggedInCookie;
