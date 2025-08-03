"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const morganFormat = ':method :url :status :res[content-length] - :response-time ms :remote-addr - :user-agent';
const morganMiddleware = (0, morgan_1.default)(morganFormat, {
    stream: {
        write: (message) => {
            const [method, url, status, responseTime] = message.trim().split(' ');
            const logObject = {
                method,
                url,
                status,
                responseTime: responseTime + ' ms',
            };
            console.log(JSON.stringify(logObject));
        },
    },
});
exports.default = morganMiddleware;
