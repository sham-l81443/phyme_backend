import { AppError } from "@/errors/AppError";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/validators/authSchema";
import { NextFunction, Response, Request } from "express";
import bcrypt from "bcrypt";
import createSuccessResponse from "@/utils/responseCreator";
import { generateJwt } from "@/utils/generateJwt";
import { generateRefreshToken } from "@/utils/generateRefreshToken";
import { USERTYPE } from "@prisma/client";

/**
 * Controller function to handle user login
 * Validates credentials, generates tokens, and sets cookies
 */
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate the request body against the login schema
        const validatedData = loginSchema.parse(req.body);

        // Find the user in the database by email and check if they are verified
        const user = await prisma.user.findUnique({
            where: { email: validatedData.email, isVerified: true },
        });

        // If user is not found or not verified, throw an error
        if (!user) {
            throw new AppError({ errorType: "Not Found", message: 'Invalid credentials' })
        }

        if (user?.password) {
            // Verify the password using bcrypt
            const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

            // If password is invalid, throw an error 
            if (!isPasswordValid) {
                throw new AppError({ errorType: "Unauthorized", message: 'Invalid credentials' })
            }
        }


        console.log(user)


        // Set a cookie with the user's ID (1 hour expiration)
        res.cookie('userId', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: true,
            maxAge: 7 * 60 * 60 * 1000, // 2 hour in milliseconds
            path: "/"
        })

        // Generate a refresh token for the user
        const refreshToken = await generateRefreshToken(user.id, 'USER');

        // Set a cookie with the refresh token (7 days expiration)
        res.cookie('refreshToken', refreshToken.plainToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: true,
            maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days in milliseconds
            path: "/"
        })

        // Generate a JWT containing user information
        const token = await generateJwt({ userId: user.id, email: user.email, role: user.userType });

        // Set a cookie with the JWT (2 hour expiration)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 120 * 60 * 1000, // 2 hour in milliseconds
        });

        // Create a success response object with user details
        const responseObj = createSuccessResponse({ data: { name: user.name, email: user.email, userType: user.userType }, message: 'Login successful' });

        // Send the success response to the client
        res.status(200).json(responseObj);

    } catch (error) {
        // Pass any errors to the next middleware for centralized error handling
        next(error)
    }
};

export default loginUser

// Flow chart diagram remains unchanged