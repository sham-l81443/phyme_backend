import { Express } from "express";

import {authRoutes} from "./modules/auth-module"
import { userRoutes } from "./modules/user-module";
import {syllabusRouter} from "./modules/syllabus-module";
import classRouter from "./modules/class-module/class.routes";
import termRouter from "./modules/term-module/term.routes";
import subjectRouter from "./modules/subject-module/subject.routes";
import chapterRouter from "./modules/chapter-module/chapter.routes";
import lessonRouter from "./modules/lesson-module/lesson.routes";
import videoRouter from "./modules/video-module/video.routes";
import subscriptionRouter from "./modules/subscription-module/subscription.routes";
import { pdfRoutes } from "./modules/pdf-module";
import healthRouter from "./modules/health/health.routes";
// import { quizRoutes } from "./modules/quiz-module";

export const appRoutes = (app: Express) => {
    
    app.use("/api", authRoutes);
    app.use("/api", userRoutes);
    app.use("/api", syllabusRouter)
    app.use("/api", classRouter)
    app.use("/api", termRouter)
    app.use("/api", subjectRouter)
    app.use("/api", chapterRouter)
    app.use("/api", lessonRouter)
    app.use("/api", videoRouter)
    app.use("/api", subscriptionRouter)
    app.use("/api", pdfRoutes)
    app.use("/api", healthRouter)
    // app.use("/api", quizRoutes)

}
