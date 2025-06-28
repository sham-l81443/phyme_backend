import { Express } from "express";
export * from './routes/constants'

import {authRoutes} from "./modules/auth-module"
import { userRoutes } from "./modules/user-module";
import {syllabusRouter} from "./modules/syllabus-module";
import classRouter from "./modules/class-module/class.routes";
import termRouter from "./modules/term-module/term.routes";

export const appRoutes = (app: Express) => {
    
    app.use("/api", authRoutes);
    app.use("/api", userRoutes);
    app.use("/api", syllabusRouter)
    app.use("/api", classRouter)
    app.use("/api", termRouter)


}
