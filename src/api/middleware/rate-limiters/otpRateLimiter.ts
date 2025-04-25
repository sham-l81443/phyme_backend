

// description: rate limiter for otp

import rateLimit from "express-rate-limit";

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many OTP attempts, please try again later.'
});

export default otpLimiter;
