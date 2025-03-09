import { AppError } from "@/errors/AppError";
import { IController } from "@/types";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import prisma from "@/lib/prisma";
import { generateJwt } from "@/utils/generateJwt";
import { generateRefreshToken } from "@/utils/generateRefreshToken";

export const authenticateAdmin: IController = async (req, res, next) => {

    try {

        const token = req.cookies.adminToken;

        if (!token) {

            res.clearCookie('token')

            const bareRefreshToken = req.cookies.adminRefreshToken as string;


            if (!bareRefreshToken) throw new AppError({ errorType: "Unauthorized", message: "Admin is not logged in" })



            const [tokenId, userRefreshToken] = bareRefreshToken.split('.')




            const refreshToken = await prisma.refreshToken.findUnique({
                where: {
                    tokenId: tokenId,
                    isRevoked: false,
                    expiresAt: {
                        gte: new Date(),
                    }
                },
                select: { Admin: true, tokenSecret: true }
            })

            if (!refreshToken) throw new AppError({ errorType: "Unauthorized", message: "Admin is not logged in" })



            const isRefreshTokenValid = await bcrypt.compare(userRefreshToken, refreshToken.tokenSecret)

            if (!isRefreshTokenValid) throw new AppError({ errorType: "Unauthorized", message: "Admin is not logged in" })


            await prisma.refreshToken.update({
                where: {
                    tokenId: tokenId
                },
                data: {
                    isRevoked: true
                }
            })


            const admin = refreshToken?.Admin

            if (!admin) throw new AppError({ errorType: "Unauthorized", message: "Admin is not logged in" })


            const newRefreshToken = await generateRefreshToken(admin.id,'ADMIN')


            res.cookie("adminRefreshToken", newRefreshToken.plainToken, {
                httpOnly: true,
                sameSite: "strict",
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                secure: process.env.NODE_ENV === "production",
                path: "/"

            })


            const accessToken = generateJwt({ email: admin?.email, role: 'admin', userId: admin?.id })


            // Set JWT token in cookie
            res.cookie("adminToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 120 * 60 * 1000,
                path: "/"
            });


            req.user = admin

            next();

        } else {

            try {

                const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

                if (typeof decoded === 'string' || !decoded.email || !decoded.role || !decoded.userId) {
                    throw new AppError({
                        errorType: "Unauthorized",
                        message: "Invalid token payload"
                    });
                }

                req.user = decoded;

                next();

            } catch (err) {

                if (err instanceof jwt.TokenExpiredError) {

                    throw new AppError({
                        errorType: "Unauthorized",
                        message: "Token expired"
                    });
                }
                else if (err instanceof jwt.JsonWebTokenError) {

                    throw new AppError({
                        errorType: "Unauthorized",
                        message: "Invalid token"
                    });
                }

                else {

                    throw err;
                }
            }

        }

    } catch (error) {

        next(error)

    }


}