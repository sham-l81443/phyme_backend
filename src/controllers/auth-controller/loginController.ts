import { AppError } from "@/errors/AppError";
import { ErrorCode } from "@/errors/errorCodes";
import { ErrorMessages } from "@/errors/errorMessages";
import { statusCode } from "@/errors/statusCode";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/validators/authSchema";
import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import createErrorObject from "@/errors/createError";

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (!user) {

            const error = createErrorObject({ errorType: "Not Found", data: { email: validatedData.email }, message: ErrorMessages.USER_NOT_FOUND });

            throw new AppError(error)

        }

        const isPasswordValid = user.password ? await bcrypt.compare(validatedData.password, user.password) : false;

        if (!isPasswordValid) {

            throw new AppError(createErrorObject({ errorType: "Unauthorized", data: null, message: ErrorMessages.INVALID_CREDENTIALS }))
        }

        const SECRET = process.env.JWT_SECRET;

        if (!SECRET) {
            throw new AppError(createErrorObject({ errorType: "Internal Server Error", data: null, message: 'jwt token creation failed' }))
        }
        const token = jwt.sign(
            { id: user.id, email: user.email },
            SECRET,
            { expiresIn: '1h' },
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });

        res.status(200).json({
            message: 'Login successful',
            user: {
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error)
    }
};

export default loginUser