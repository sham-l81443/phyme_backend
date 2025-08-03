"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createEndpoint = (endpoint) => {
    return `/api/${endpoint}`;
};
exports.default = createEndpoint;
