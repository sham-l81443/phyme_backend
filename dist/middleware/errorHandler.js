"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, _req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: "error",
        message: err.message || "An error occurred while processing your request",
    });
    next(err);
};
exports.default = errorHandler;
