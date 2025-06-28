import { z } from "zod";

export const SCHEMA = {
    uniqueCode: z.string()
        .min(2, { message: "Unique code must be at least 2 characters." })
        .regex(/^[A-Z0-9]+$/, {
            message: "Unique code must contain only uppercase letters and numbers, with no spaces.",
        }),

    name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(20, { message: "Name must be at most 50 characters." }),
    description: z.string().optional(),
    email: z.string().email({ message: "please enter a valid email" }),
    phone: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^[0-9]{10}$/.test(val),
            { message: "Please enter a valid phone number" }
        ),
    required: z.string().min(1, { message: "Field required" }),
    otp: z.string().min(1, { message: "OTP required" }).refine((value) => /^\d+$/.test(value), { message: "OTP must contain only numbers" }),
    registrationTypeDefault: z.enum(['DEFAULT', 'SSO']).default('DEFAULT'),
    password: z.string().min(1, { message: "password is required" }).min(8, { message: "password must be at least 8 characters" }),
    confirmPassword: z.string().min(1, { message: 'Confirm password required' }),
} 