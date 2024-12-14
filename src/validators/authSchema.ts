import { z } from 'zod'


export const registerSchema = z.object({

    name: z.string({ message: "name is required" }).min(3, { "message": "name must be at least 3 characters" }).max(20, { "message": "name must be at most 20 characters" }),
    
    email: z.string({ message: "email is required" }).email({ message: "invalid email" }),
    
    phone: z
        .string({ message: "Phone number is required" })
        .regex(/^(\+?\d{1,3}[- ]?)?\d{10}$/, { message: "Invalid phone number format" }),
    
    role: z.enum(["USER", "ADMIN"], { message: "role must be either 'user' or 'admin'" }).default("USER"),
})

export type RegisterSchema = z.infer<typeof registerSchema>;