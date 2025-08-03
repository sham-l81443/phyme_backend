"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = void 0;
__exportStar(require("./routes/constants"), exports);
const auth_module_1 = require("./modules/auth-module");
const user_module_1 = require("./modules/user-module");
const syllabus_module_1 = require("./modules/syllabus-module");
const class_routes_1 = __importDefault(require("./modules/class-module/class.routes"));
const term_routes_1 = __importDefault(require("./modules/term-module/term.routes"));
const subject_routes_1 = __importDefault(require("./modules/subject-module/subject.routes"));
const chapter_routes_1 = __importDefault(require("./modules/chapter-module/chapter.routes"));
const lesson_routes_1 = __importDefault(require("./modules/lesson-module/lesson.routes"));
const video_routes_1 = __importDefault(require("./modules/video-module/video.routes"));
const subscription_routes_1 = __importDefault(require("./modules/subscription-module/subscription.routes"));
const appRoutes = (app) => {
    app.use("/api", auth_module_1.authRoutes);
    app.use("/api", user_module_1.userRoutes);
    app.use("/api", syllabus_module_1.syllabusRouter);
    app.use("/api", class_routes_1.default);
    app.use("/api", term_routes_1.default);
    app.use("/api", subject_routes_1.default);
    app.use("/api", chapter_routes_1.default);
    app.use("/api", lesson_routes_1.default);
    app.use("/api", video_routes_1.default);
    app.use("/api", subscription_routes_1.default);
};
exports.appRoutes = appRoutes;
