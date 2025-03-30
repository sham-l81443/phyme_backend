import { AppError } from '@/errors/AppError'
import prisma from '@/lib/prisma'
import createSuccessResponse from '@/utils/responseCreator'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

const formSchema = z.object({
    name: z.string().min(3, {
        message: "Video title must be at least 3 characters.",
    }),
    description: z.string().optional(),

    embedLink: z.string().min(1, {
        message: "Please enter a valid URL.",
    }),
    duration: z.string().min(1, {
        message: "Duration is required.",
    }),
    date: z.string({
        message: "Please select a date.",
    }),
    thumbnail: z.string().min(1, {
        message: "Please enter a valid thumbnail URL.",
    }),
})

export default async function addLiveVideoController(req: Request, res: Response, next: NextFunction) {

    try {

        const validatedData = formSchema.safeParse(req.body)

        if (validatedData?.success === false) {
            throw new AppError({
                errorType: 'Bad Request',
                data: validatedData?.error,
                message: 'Please provide valid data',
            })
        }


        const { name, description, embedLink, duration, date, thumbnail } = validatedData?.data


        const newVideo = await prisma.video.create({
            data: {
                name: name,
                description: description,
                embedLink: embedLink,
                duration: duration,
                date: date,
                thumbnail: thumbnail,
                videoType: 'TUTION'
            }

        })


        const resData = createSuccessResponse({
            data: newVideo,
            message: 'Video added successfully',
            status: 'success',
            code: 201,
            timestamp: new Date().toISOString()
        })

        return res.status(201).json(resData)


    } catch (error) {

        next(error)
    }



}

// model Video {
//     id          String    @id @default(uuid()) @db.Uuid
//     name        String
//     description String
//     embedLink   String
//     duration    Float
//     date        DateTime
//     thumbnail   String
//     videoType   VIDEOTYPE
//     updatedAt   DateTime  @default(now())
//     createdAt   DateTime  @default(now())
//     note        Note?     @relation(fields: [noteId], references: [id])
//     noteId      String?
//   }
