import { Express } from "express";
export * from './constants'
import authRoutes from "./auth.routes";
import syllabusRouter from "./syllabus.routes";
import classRouter from './class.routes'
import detailsRouter from "./details.routes";
import videosRouter from "./videos.routes";



export const appRoutes = (app: Express) => {
    app.use("/api", authRoutes);


    //admin
    app.use('/api/syllabus', syllabusRouter)
    app.use('/api/class', classRouter)

    //student
    app.use('/api/videos', videosRouter)
    app.use('/api/tuition/list', detailsRouter)





}




