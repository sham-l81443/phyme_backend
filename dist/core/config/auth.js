"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMON_CONFIG = exports.STUDENT_CONFIG = exports.ADMIN_CONFIG = void 0;
exports.ADMIN_CONFIG = {
    secret: process.env.ADMIN_AUTH_SECRET,
    jwtAccessTokenExpiry: "1d",
    refreshTokenExpiry: 1000 * 60 * 60 * 24 * 14,
    accessTokenExpiry: 1000 * 60 * 60 * 24,
    ADMIN_ACCESS_TOKEN_KEY: 'a_a_t',
    ADMIN_REFRESH_TOKEN_KEY: 'a_r_t',
    LOGGED_IN_KEY: 'admin_logged_in'
};
exports.STUDENT_CONFIG = {
    secret: process.env.ADMIN_AUTH_SECRET,
    jwtAccessTokenExpiry: "1d",
    refreshTokenExpiry: 1000 * 60 * 60 * 24 * 14,
    accessTokenExpiry: 1000 * 60 * 60 * 24,
    userTokenExpiry: 1000 * 60 * 10,
    STUDENT_ACCESS_TOKEN_KEY: 's_a_t',
    STUDENT_REFRESH_TOKEN_KEY: 's_r_t',
    STUDENT_USER_ID_TOKEN_KEY: 's_u_i',
    LOGGED_IN_KEY: 's_l_i'
};
exports.COMMON_CONFIG = {
    OTP_EXPIRY_MINUTES: 10,
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    SUCCESS_REDIRECT_URL: process.env.FRONTEND_URL + '/student/dashboard' || "http://localhost:3000/student/dashboard",
    FAILURE_REDIRECT_URL: process.env.FRONTEND_URL + '/login' || "http://localhost:3000/login"
};
