import { AppError } from "@/utils/errors/AppError";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/schema/authSchema";
import { NextFunction, Response, Request } from "express";
import bcrypt from "bcrypt";
import createSuccessResponse from "@/utils/responseCreator";
import { generateStudentAccessToken } from "@/utils/jwt/generate";
import { generateRefreshToken } from "@/utils/jwt/generateRefreshToken";
import { UserRole } from "@/constants/enums/user";
import { setAccessTokenCookie, setRefreshTokenCookie } from "@/utils/cookies/setRefreshCookie";
import { logger } from "@/utils/logger";
import { Prisma } from "@prisma/client";

/**
 * Controller function to handle user login
 * Validates credentials, generates tokens, and sets cookies
 */
const studentLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate the request body against the login schema
        const validatedData = loginSchema.parse(req.body);

        // Find the user in the database by email and check if they are verified
        const user = await prisma.user.findUnique({
            where: { email: validatedData.email, isVerified: true, isBlocked: false },
            include: { class: true }, // Include related class data
        });

        // If user is not found or not verified, throw an error
        if (!user) {
            throw new AppError({ errorType: "Not Found", message: 'Invalid credentials or not verified' })
        }

        if (user?.password) {
            // Verify the password using bcrypt
            const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

            // If password is invalid, throw an error 
            if (!isPasswordValid) {
                throw new AppError({ errorType: "Unauthorized", message: 'Invalid credentials' })
            }
        }


        logger.log('user data', user)

        // Generate a refresh token for the user
        const refreshToken = await generateRefreshToken(user.id, UserRole.STUDENT);

        const accessToken = generateStudentAccessToken({ class: user.class?.name || '', email: user.email, id: user.id, role: UserRole.STUDENT, subscriptionType: user.subscriptionType });

        setRefreshTokenCookie({ res, cookieValue: refreshToken.plainToken, usageType: UserRole.STUDENT })

        setAccessTokenCookie({ res, cookieValue: accessToken, usageType: UserRole.STUDENT })


        // Create a success response object with user details
        const responseObj = createSuccessResponse({ data: {}, message: 'Login successful' });

        // Send the success response to the client
        res.status(200).json(responseObj);

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {

            logger.error("Database error", { error: error.message });

            return next(new AppError({ errorType: "Internal Server Error", message: "Database unavailable" }));

        }

        logger.error("Google login error", { error: error instanceof Error ? error.message : String(error) });
        next(error);
    }
};

export default studentLogin
