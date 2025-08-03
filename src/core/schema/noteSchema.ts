import { z } from "zod";

export const createNoteSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    importance: z.enum(["LOW", "MEDIUM", "HIGH"]),
    chapterId: z.string().uuid("Invalid chapter ID")
});
