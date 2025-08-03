"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const AppError_1 = require("@/core/utils/errors/AppError");
class UserController {
    static async getUserByIdController(req, res, next) {
        const user = req.user;
        try {
            if (!user) {
                throw new AppError_1.AppError({ errorType: 'Unauthorized', message: 'User not found' });
            }
            const userData = await user_service_1.UserServices.getUserById({ id: user.id });
            res.status(200).json((0, responseCreator_1.default)({
                data: userData,
                message: "User fetched successfully",
            }));
        }
        catch (error) {
            next(error);
        }
    }
    static async editUserByIdController(req, res, next) {
        const user = req.user;
        console.log(user);
        try {
            if (!user) {
                throw new AppError_1.AppError({ errorType: 'Unauthorized', message: 'User not found' });
            }
            const userData = await user_service_1.UserServices.updateUserById({ id: user.id, data: req.body });
            res.status(200).json((0, responseCreator_1.default)({
                data: userData,
                message: "User fetched successfully",
            }));
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllUserController(req, res, next) {
        try {
            const allUsers = await user_service_1.UserServices.getAllUserService();
            const responseData = (0, responseCreator_1.default)({ data: allUsers, message: 'All users fetched successfully' });
            res.status(200).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
