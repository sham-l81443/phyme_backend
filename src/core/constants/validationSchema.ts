import { z } from "zod";

export const EMAIL_SCHEMA = z.string().email({ message: "please enter a valid email" })
export const REQUIRED_STRING_SCHEMA = z.string().min(1, { message: "Field required" })
export const REQUIRED_NUMBER_SCHEMA = z.number().min(1, { message: "Field required" })
export const OPTIONAL_STRING_SCHEMA = z.string().optional()

export const CODE_SCHEMA = z
  .string()
  .min(1, { message: "Field required" })
  .refine((val) => /^[A-Z0-9]+$/.test(val), {
    message: "Code must contain only uppercase letters and numbers",
  });

export const PHONE_NUMBER_SCHEMA = z
    .string()
    .optional()
    .refine(
        (val) => !val || /^[0-9]{10}$/.test(val),
        { message: "Please enter a valid phone number" }
    );

export const PASSWORD_SCHEMA = z
.string()
.min(8, { message: "Password must be at least 8 characters" })
.refine((val) => /[A-Z]/.test(val), {
  message: "Password must contain at least one uppercase letter",
})
.refine((val) => /[^a-zA-Z0-9]/.test(val), {
  message: "Password must contain at least one special character",
});

export const REGISTRATION_TYPE_SCHEMA_DEFAULT = z.enum(['DEFAULT', 'SSO']).default('DEFAULT')

export const OTP_SCHEMA = z.string().min(1, { message: "OTP required" }).refine((value) => /^\d+$/.test(value), { message: "OTP must contain only numbers" })