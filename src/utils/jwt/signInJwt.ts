import { AppError } from "@/utils/errors/AppError";
import jwt from "jsonwebtoken";


// Shared JWT signing logic
export const signJwt = (payload: Record<string, any>, expiry: string = "1d"): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret || typeof secret !== "string" || secret.length < 32) {
        throw new AppError({
            errorType: "Internal Server Error",
            message: "JWT secret is not configured properly",
        });
    }

    const algorithm = "HS256";

    return jwt.sign(payload, secret, { expiresIn: expiry, algorithm });
};

export default signJwt;