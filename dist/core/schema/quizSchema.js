"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishQuizSchema = exports.createQuizSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createQuizSchema = zod_1.default.object({
    title: zod_1.default.string().min(1, { message: "Title required" }).min(3, { message: "Title must be at least 3 characters" }).max(20, { message: "Title must not exceed 20 characters" }),
    description: zod_1.default.string().min(1, { message: "Description required" }).min(3, { message: "Description must be at least 3 characters" }).max(50, { message: "Description must not exceed 20 characters" }),
});
exports.publishQuizSchema = zod_1.default.object({
    quizId: zod_1.default.string().min(1, { message: 'Please provide a valid quiz id' })
});
