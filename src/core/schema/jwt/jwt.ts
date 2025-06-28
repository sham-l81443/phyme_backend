import { z } from "zod";

export const StudentAccessTokenSchema = z.object({

    id: z.string().uuid({ message: "Invalid or missing user ID (must be a valid UUID)" }),

    email: z.string().email({ message: "Invalid or missing email" }),

    // subscriptionType: z.enum(["FREE", "PREMIUM"], {
    //     errorMap: () => ({ message: "Invalid or missing subscription type" }),
    // }),

    classId: z.string({
        errorMap: () => ({ message: "Invalid or missing class" }),
    }).cuid({ message: "Invalid or missing class" }),

    syllabusId: z.string({
        errorMap: () => ({ message: "Invalid or missing syllabus" }),
    }).cuid({ message: "Invalid or missing syllabus" }),

    role: z.enum(["STUDENT"], {
        errorMap: () => ({ message: "Invalid or missing role" }),
    }),

});


export const AdminAccessTokenSchema = z.object({

    id: z.string().uuid({ message: "Invalid or missing user ID (must be a valid UUID)" }),

    email: z.string().email({ message: "Invalid or missing email" }),

    role: z.enum(["ADMIN"], {
        errorMap: () => ({ message: "Invalid or missing role" }),
    }),

});


export type IStudentAccessToken = z.infer<typeof StudentAccessTokenSchema>;

export type IAdminAccessToken = z.infer<typeof AdminAccessTokenSchema>;



