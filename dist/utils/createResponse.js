"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuccessResponse = createSuccessResponse;
function createSuccessResponse({ data, message }) {
    return { data, message, error: null, success: true };
}
