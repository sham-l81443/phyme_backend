import { z } from "zod";
import { IMPORTANCE } from "@prisma/client";

export const createNoteSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    importance: z.enum([IMPORTANCE.LOW, IMPORTANCE.MEDIUM, IMPORTANCE.HIGH]),
    chapterId: z.string().uuid("Invalid chapter ID")
});
