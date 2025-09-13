import { validateDto } from "../../../core/utils";
import { rethrowAppError } from "../../../core/utils/errors/rethrowError";
import { AppError } from "../../../core/utils/errors/AppError";
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

    static async updateChapterService(id: string, body: any) {
        try {
            // Check if chapter exists
            const existingChapter = await ChapterRepository.findById(id);
            if (!existingChapter) {
                throw new AppError({ errorType: "Not Found", message: "Chapter not found" });
            }

            // Validate the update data
            const validatedData = validateDto(ChapterValidation.createChapterSchema, body);

            return await ChapterRepository.update(id, validatedData);

        } catch (error) {
            rethrowAppError(error, 'Failed to update chapter');
        }
    }

    static async deleteChapterService(id: string) {
        try {
            // Check if chapter exists
            const existingChapter = await ChapterRepository.findById(id);
            if (!existingChapter) {
                throw new AppError({ errorType: "Not Found", message: "Chapter not found" });
            }

            // Check if chapter has associated lessons
            if (existingChapter._count.lessons > 0) {
                throw new AppError({ 
                    errorType: "Conflict", 
                    message: "Cannot delete chapter with associated lessons" 
                });
            }

            return await ChapterRepository.delete(id);

        } catch (error) {
            rethrowAppError(error, 'Failed to delete chapter');
        }
    }

}

