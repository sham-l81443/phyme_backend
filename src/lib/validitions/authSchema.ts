import z from 'zod';


const EMAIL_SCHEMA = z.string().min(1, { message: "Email is required" }).email({ message: "please enter a valid email" })
const REQUIRED_STRING_SCHEMA = z.string().min(1, { message: "Field required" })
const PHONE_NUMBER_SCHEMA = z
    .string()
    .optional()
    .refine(
        (val) => !val || /^[0-9]{10}$/.test(val),
        { message: "Please enter a valid phone number" }
    );

const PASSWORD_SCHEMA = z.string().min(1, { message: "password is required" }).min(8, { message: "password must be at least 8 characters" })
const REGISTRATION_TYPE_SCHEMA_DEFAULT = z.enum(['DEFAULT', 'SSO']).default('DEFAULT')

const OTP_SCHEMA = z.string().min(1, { message: "OTP required" }).refine((value) => /^\d+$/.test(value), { message: "OTP must contain only numbers" })

export const loginSchema = z.object({
    email: EMAIL_SCHEMA,
    password: REQUIRED_STRING_SCHEMA,
})


export const signupSchema = z.object({
    email: EMAIL_SCHEMA,
    registrationType: REGISTRATION_TYPE_SCHEMA_DEFAULT,
})


export const verifyAccountSchema = z.object({
    otp: OTP_SCHEMA,
    password: PASSWORD_SCHEMA,
    confirmPassword: z.string().min(1, { message: 'Confirm password required' })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});


export type ILogInFormValues = z.infer<typeof loginSchema>;
export type IVerifyFormValues = z.infer<typeof verifyAccountSchema>;
export type ISignUpFormValues = z.infer<typeof signupSchema>;
