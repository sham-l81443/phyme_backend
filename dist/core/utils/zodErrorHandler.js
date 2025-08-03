"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (error) => {
    const message = [];
    error.issues.filter((item) => {
        message.push(item.message);
    });
    return message;
};
exports.default = handleZodError;
