"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSubscribed = void 0;
const AppError_1 = require("@/core/utils/errors/AppError");
const isSubscribed = (req, _, next) => {
    try {
        if (!(req === null || req === void 0 ? void 0 : req.user)) {
            throw new AppError_1.AppError({ errorType: "Unauthorized", message: "User is not logged in" });
        }
        const user = req === null || req === void 0 ? void 0 : req.user;
        if ((user === null || user === void 0 ? void 0 : user.role) !== 'PAID') {
            throw new AppError_1.AppError({ errorType: "Forbidden", message: "Please subscribe to use this feature" });
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.isSubscribed = isSubscribed;
