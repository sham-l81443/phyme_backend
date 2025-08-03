"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_ENDPOINTS = exports.STUDENT_ENDPOINTS = void 0;
exports.STUDENT_ENDPOINTS = {
    login: '/login',
    register: '/register',
    verifyEmail: '/verify',
    resetPassword: '/reset-password',
    googleAuth: '/google/callback',
    profileComplete: '/profile/create',
    details: '/details',
    tutionVideos: '/list',
};
exports.ADMIN_ENDPOINTS = {
    login: '/admin/login',
    createClass: '/create',
    getClass: '/list',
    createVideo: '/create',
    getVideo: '/list',
    createSubject: '/create',
};
