import { z } from "zod"

export const createChapterSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(3, "Description must be at least 3 characters"),
    class: z.enum([
        "CLASS_ONE", "CLASS_TWO", "CLASS_THREE", "CLASS_FOUR", "CLASS_FIVE", "CLASS_SIX",
        "CLASS_SEVEN", "CLASS_EIGHT", "CLASS_NINE", "CLASS_TEN", "CLASS_ELEVEN", "CLASS_TWELVE"
    ])
})



export const deleteChapterSchema = z.object({
    id: z.string().uuid("Invalid chapter ID")
})