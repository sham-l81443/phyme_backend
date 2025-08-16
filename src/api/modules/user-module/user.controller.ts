import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import createSuccessResponse from "../../../core/utils/responseCreator";
import { AppError } from "../../../core/utils/errors/AppError";
import { IAdminAccessToken, IStudentAccessToken } from "../../../core/schema";

export class UserController {

    static async getUserByIdController(req: Request, res: Response, next: NextFunction) {

        const user = req.user as IStudentAccessToken | IAdminAccessToken


        try {

            if (!user) {
                throw new AppError({ errorType: 'Unauthorized', message: 'User not found' })
            }

            const userData = await UserServices.getUserById({ id: user.id })

            res.status(200).json(
                createSuccessResponse({
                    data: userData,
                    message: "User fetched successfully",
                })
            );

        } catch (error) {

            next(error)

        }
    }

    static async editUserByIdController(req: Request, res: Response, next: NextFunction) {

        const user = req.user as IStudentAccessToken | IAdminAccessToken

        console.log(user)

        try {

            if (!user) {
                throw new AppError({ errorType: 'Unauthorized', message: 'User not found' })
            }

            const userData = await UserServices.updateUserById({ id: user.id, data: req.body })

            res.status(200).json(
                createSuccessResponse({
                    data: userData,
                    message: "User fetched successfully",
                })
            );

        } catch (error) {

            next(error)

        }
    }

    static async getAllUserController(req: Request, res: Response, next: NextFunction) {

        try {
            const allUsers = await UserServices.getAllUserService()
            const responseData = createSuccessResponse({ data: allUsers, message: 'All users fetched successfully' })
            res.status(200).json(responseData)
        } catch (error) {
            next(error)
        }
    }


    static async logoutController(req: Request, res: Response, next: NextFunction) {

        try {

            res.clearCookie('s_r_t')
            res.clearCookie('s_a_t')
            res.clearCookie('a_r_t')
            res.clearCookie('a_a_t')

            res.status(200).json(
                createSuccessResponse({
                    data: null,
                    message: "Logout successful",
                })
            );

        } catch (error) {

            next(error)

        }

    }

}