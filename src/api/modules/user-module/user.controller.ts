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


    static async getStudentDetailsByIdController(req:Request,res:Response,next:NextFunction){
        const {userId} = req.query

        console.log(userId)
        try{
            const user = await UserServices.getStudentDetailsById(userId as string)
        

        res.status(200).json(
            createSuccessResponse({
                data: user,
                message: "User fetched successfully",
            })
        );

        }catch(error){

            next(error)

        }   
        
    }

    static async verifyUserController(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.body;

        try {
            const verifiedUser = await UserServices.verifyUserService({ userId });

            res.status(200).json(
                createSuccessResponse({
                    data: verifiedUser,
                    message: "User verified successfully",
                })
            );
        } catch (error) {
            next(error);
        }
    }

    static async addPasswordForUserController(req: Request, res: Response, next: NextFunction) {
        const { userId, password } = req.body;

        try {
            const updatedUser = await UserServices.addPasswordForUserService({ userId, password });

            res.status(200).json(
                createSuccessResponse({
                    data: updatedUser,
                    message: "Password added successfully",
                })
            );
        } catch (error) {
            next(error);
        }
    }

    static async getUnverifiedUsersController(req: Request, res: Response, next: NextFunction) {
        const { page, limit } = req.query;

        try {
            const result = await UserServices.getUnverifiedUsersService({ 
                page: page ? parseInt(page as string) : 1, 
                limit: limit ? parseInt(limit as string) : 10 
            });

            res.status(200).json(
                createSuccessResponse({
                    data: result,
                    message: "Unverified users fetched successfully",
                })
            );
        } catch (error) {
            next(error);
        }
    }

}