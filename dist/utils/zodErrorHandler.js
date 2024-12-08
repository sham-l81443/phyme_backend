"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (error) => {
    const { issues } = error;
    return issues[0].message;
};
exports.default = handleZodError;
