import { AppError } from '@/core/utils/errors/AppError'
import prisma from '@/core/lib/prisma'
import createSuccessResponse from '@/core/utils/responseCreator'
import { Request, Response, NextFunction } from 'express'
import { validateDto } from '@/core/utils'
import { CreateVideoSchema } from '@/core/schema/video.schema'
import { videoRepository } from '@/api/repositories/video.repository'


export default async function addLiveVideoController(req: Request, res: Response, next: NextFunction) {

    try {

        const validatedData = validateDto(CreateVideoSchema, req.body) 

        const newVideo = await videoRepository.createVideo(validatedData)


        const resData = createSuccessResponse({
            data: newVideo,
            message: 'Video added successfully',
        })

        res.status(201).json(resData)


    } catch (error) {

        next(error)
    }



}
