import { z } from "zod";

// Zod schema for Google profile
export const GoogleProfileSchema = z.object({
    id: z.string().min(1, "Google ID is required"),
    emails: z
        .array(
            z.object({
                value: z.string().email("Invalid email format"),
                verified: z.boolean(),
            })
        )
        .min(1, "At least one email is required"),
    displayName: z.string().optional(),
    photos: z
        .array(
            z.object({
                value: z.string().url("Invalid photo URL").optional(),
            })
        )
        .optional(),
});

export type IGoogleProfile = z.infer<typeof GoogleProfileSchema>;