"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createSuccessResponse;
function createSuccessResponse({ data, message = "successful", success = true, timestamp = new Date().toISOString(), meta = null }) {
    return { data, message, success, timestamp, meta };
}
