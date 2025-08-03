"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = void 0;
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
