import { validateDto } from "../../../core/utils";
import { rethrowAppError } from "../../../core/utils/errors/rethrowError";
import { ChapterRepository } from "./chapter.repository";
import { ChapterValidation } from "./chapter.validation";



export class ChapterService {


    static async createChapterService(body: any) {

        try {

            const validateData = validateDto(ChapterValidation.createChapterSchema, body)

            const chapter = await ChapterRepository.createChapter(validateData)

            return chapter

        } catch (error) {

            rethrowAppError(error, 'Failed to create new folder')

        }

    }

    static async findAll() {
        try {
            const allChapters = await ChapterRepository.findAll()
            return allChapters
        } catch (error) {
            rethrowAppError(error, 'Failed to fetch all chapters')
        }
    }

    // get chapter by term id and subject id

    static async findByTermIdAndSubjectId(params: any) {
        try {
            const validateData = validateDto(ChapterValidation.findByTermIdAndSubjectIdSchema, params)
            const { subjectId, termId } = validateData
            const chapter = await ChapterRepository.findChapterBySubjectIdAndTermId({
                subjectId,
                termId: termId
            })
            return chapter
        } catch (error) {
            rethrowAppError(error, 'Failed to fetch chapter')
        }
    }

}

