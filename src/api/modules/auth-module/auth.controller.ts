import { NextFunction, Request, response, Response } from "express";
import { AuthValidation } from "./auth.validation";
import { AppError } from "@/core/utils/errors/AppError";
import { AuthService } from "./auth.service";
import { UserRole } from "@/core/constants/ENUMS/user";
import { setRefreshTokenCookie, setAccessTokenCookie } from "@/core/utils/cookies";
import { generateRefreshToken, generateStudentAccessToken } from "@/core/utils/jwt";
import createSuccessResponse from "@/core/utils/responseCreator";
import { STUDENT_CONFIG } from "@/core/config/auth";

export class AuthController {

    static async studentRegisterController(req: Request, res: Response, next: NextFunction) {


        try {

            const validatedData = AuthValidation.registerSchema.safeParse(req.body)

            if (!validatedData.success) {
                throw new AppError({ errorType: "Bad Request", message: "Invalid request body", data: validatedData.error })
            }


            const newStudent = await AuthService.studentRegisterService(validatedData.data)

            res.cookie(STUDENT_CONFIG.STUDENT_USER_ID_TOKEN_KEY, newStudent.user.id, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: STUDENT_CONFIG.userTokenExpiry,
                path: '/',
            })

            const data = { email: newStudent.user.email }

            const responseData = createSuccessResponse({ data: data, message: 'User registered successfully' })

            res.status(201).json(responseData)

        } catch (error) {

            next(error)
        }
    }



    static async studentLoginController(req: Request, res: Response, next: NextFunction) {


        try {

            const validatedData = AuthValidation.loginSchema.safeParse(req.body)

            if (!validatedData.success) {
                throw new AppError({ errorType: "Bad Request", message: "Invalid request body", data: validatedData.error })
            }

            const student = await AuthService.studentLoginService(validatedData.data)


            const refreshToken = await generateRefreshToken(student.id, UserRole.STUDENT);

            const accessToken = generateStudentAccessToken({ classId: student.class?.id || '', email: student.email, id: student.id, role: UserRole.STUDENT, syllabusId: student.syllabusId || '' });


            setRefreshTokenCookie({ res, cookieValue: refreshToken.plainToken, usageType: UserRole.STUDENT })

            setAccessTokenCookie({ res, cookieValue: accessToken, usageType: UserRole.STUDENT })


            const responseObj = createSuccessResponse({ data: {}, message: 'Login successful' });

            res.status(200).json(responseObj);


        } catch (error) {

            next(error)
        }

    }


    static async verifyStudentController(req: Request, res: Response, next: NextFunction) {
        try {

            const validatedData = AuthValidation.verifyEmailOtpPasswordSchema.safeParse(req.body)

            if (!validatedData.success) {
                throw new AppError({ errorType: "Bad Request", message: "Invalid request body", data: validatedData.error })
            }

            const { updatedUser, accessToken, refreshToken } = await AuthService.verifyStudentService({ validatedData: validatedData.data })


            setAccessTokenCookie({ res, cookieValue: accessToken, usageType: UserRole.STUDENT });
            setRefreshTokenCookie({ res, cookieValue: refreshToken, usageType: UserRole.STUDENT });

            res.status(201).json(
                createSuccessResponse({
                    data: updatedUser,
                    message: "User verified successfully",
                })
            );

        } catch (error) {

            next(error)
        }
    }


    static async resetStudentPassword(req: Request, res: Response, next: NextFunction) {

        try {

            const updatedUser = AuthService.resetStudentPassword(req.body)


            const responseData = createSuccessResponse({ data: updatedUser, message: 'User password reset successful' })

            res.status(201).json(responseData)

        } catch (error) {
            next(error)
        }

    }


    static async getRestPasswordOtp(req: Request, res: Response, next: NextFunction) {

        console.log(req.body)

        try {

            const data = await AuthService.getOtp({ body: req.body })

            res.status(201).json(
                createSuccessResponse({
                    data: { email: data?.user?.email },
                    message: "We have sent an otp to your email",
                })
            );

        } catch (error) {
            next(error)
        }

    }


    //admin
    static async adminLoginController(req: Request, res: Response, next: NextFunction) {
        try {

            const { admin, token, refreshToken } = await AuthService.adminLoginService({ body: req.body })

            setAccessTokenCookie({ res, cookieValue: token, usageType: UserRole.ADMIN });
            setRefreshTokenCookie({ res, cookieValue: refreshToken.plainToken, usageType: UserRole.ADMIN });

            const responseObj = createSuccessResponse({ data: admin, message: 'Login successful' });

            res.status(200).json(responseObj);

        } catch (error) {
            next(error)
        }
    }
}

