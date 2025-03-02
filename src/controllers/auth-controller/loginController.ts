import { AppError } from "@/errors/AppError";
import { ErrorCode } from "@/errors/errorCodes";
import { ErrorMessages } from "@/errors/errorMessages";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/validators/authSchema";
import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import createSuccessResponse from "@/utils/responseCreator";
import { generateJwt } from "@/utils/generateJwt";
import { generateRefreshToken } from "@/utils/generateRefreshToken";

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email: validatedData.email, isVerified: true },
        });

        if (!user) {

            throw new AppError({ errorType: "Not Found", message: 'User doest not exist' })

        }

        const isPasswordValid = user?.password ? await bcrypt.compare(validatedData.password, user.password) : false;

        if (!isPasswordValid) {

            throw new AppError({ errorType: "Unauthorized", message: 'Invalid credentials' })
        }

        res.cookie('userId', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: true,
            maxAge: 60 * 60 * 1000,
            path: "/"
        })

        const refreshToken = await generateRefreshToken(user.id);

        res.cookie('refreshToken', refreshToken.plainToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: true,
            maxAge: 60 * 60 * 24 * 7 * 1000,
            path: "/"
        })


        const token = await generateJwt({ userId: user.id, email: user.email, role: user.userType });


        // set cookie

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });

        const responseObj = createSuccessResponse({ data: { name: user.name, email: user.email }, message: 'Login successful' });

        res.status(200).json(responseObj);

    } catch (error) {
        next(error)
    }
};

export default loginUser