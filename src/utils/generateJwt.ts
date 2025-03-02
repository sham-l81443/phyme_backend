import { AppError } from "@/errors/AppError";
import jwt from "jsonwebtoken";



export const generateJwt = ({ userId, email, role, expiry = '2h' }: { userId: string, email: string, role: string, expiry?: string }) => {

    try {
        const secret = process.env.JWT_SECRET

        if (!secret) throw new AppError({ errorType: "Internal Server Error", message: 'Internal server error' })


        const token = jwt.sign({ userId, email, role }, process.env.JWT_SECRET as string, { expiresIn: expiry })

        return token


    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError({
            errorType: "Internal Server Error",
            message: "Failed to generate JWT",
            data: error
        });
    }



};