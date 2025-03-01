import z from "zod"



export const createQuizSchema = z.object({
    title: z.string().min(1, { message: "Title required" }).min(3, { message: "Title must be at least 3 characters" }).max(20, { message: "Title must not exceed 20 characters" }),
    description: z.string().min(1, { message: "Description required" }).min(3, { message: "Description must be at least 3 characters" }).max(50, { message: "Description must not exceed 20 characters" }),
})


export type IcreateQuiz = z.infer<typeof createQuizSchema>


export const publishQuizSchema = z.object({
    quizId: z.string().min(1, { message: 'Please provide a valid quiz id' })
})


export type IPulishQuiz = z.infer<typeof publishQuizSchema>