import prisma from "../../../core/lib/prisma";

export class VideoRepository {
    
    static createVideo = async (data: {
        name: string;
        description?: string;
        embedLink: string;
        duration?: string;
        code: string;
        thumbnail?: string;
        lessonId: string;
    }) => {
        return await prisma.video.create({
            data: {
                name: data.name,
                description: data.description,
                embedLink: data.embedLink,
                duration: data.duration,
                code: data.code,
                thumbnail: data.thumbnail,
                lessonId: data.lessonId,
                isFree:true
            },
        });
        
    }

    static getAllVideos = async () => {
        return await prisma.video.findMany({
            include:{
                lesson:{
                    select:{
                        name:true,
                        chapter:{
                            select:{
                                name:true,
                            }
                        }
                    }
                }
            }
        })
    }


    static getAllVideosByLessonId = async (lessonId: string) => {
        return await prisma.video.findMany({
            where:{
                lessonId:lessonId
            },
            omit:{
                embedLink:true
            }
        })
    }

    static getVideoById = async (id: string) => {
        return await prisma.video.findUnique({
            where:{
                id:id
            },
            select:{
                embedLink:true
            }
        })
    }

    static findById = async (id: string) => {
        return await prisma.video.findUnique({
            where: { id },
            include: {
                lesson: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        });
    }

    static update = async (id: string, data: any) => {
        return await prisma.video.update({
            where: { id },
            data,
            include: {
                lesson: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        });
    }

    static delete = async (id: string) => {
        return await prisma.video.delete({
            where: { id }
        });
    }
}
