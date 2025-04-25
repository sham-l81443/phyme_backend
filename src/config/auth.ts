export const ADMIN_CONFIG = {
    secret: process.env.ADMIN_AUTH_SECRET,
    jwtAccessTokenExpiry: "1d",           // should be same as [accessTokenExpiry]
    refreshTokenExpiry: 1000 * 60 * 60 * 24 * 14, // 14 days
    accessTokenExpiry: 1000 * 60 * 60 * 24,   // 1 day (1440 minutes) // should be same as [jwtAccessTokenExpiry]
    ADMIN_ACCESS_TOKEN_KEY: 'a_a_t',
    ADMIN_REFRESH_TOKEN_KEY: 'a_r_t'
}

export const STUDENT_CONFIG = {
    secret: process.env.ADMIN_AUTH_SECRET,
    jwtAccessTokenExpiry: "1d", // should be same as [accessTokenExpiry]
    refreshTokenExpiry: 1000 * 60 * 60 * 24 * 14, // 14 days 
    accessTokenExpiry: 1000 * 60 * 60 * 24,    // 1 day (1440 minutes) // should be same as [jwtAccessTokenExpiry]
    userTokenExpiry: 1000 * 60 * 10,           // 10 minutes
    STUDENT_ACCESS_TOKEN_KEY: 's_a_t',
    STUDENT_REFRESH_TOKEN_KEY: 's_r_t',
    STUDENT_USER_ID_TOKEN_KEY: 's_u_i'
}



export const COMMON_CONFIG = {
    OTP_EXPIRY_MINUTES: 10,
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    SUCCESS_REDIRECT_URL: process.env.FRONTEND_URL + '/student/dashboard' || "http://localhost:3000/student/dashboard",
    FAILURE_REDIRECT_URL: process.env.FRONTEND_URL + '/login' || "http://localhost:3000/login"
}