import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ message: "name is required" })
    .min(3, { message: "name must be at least 3 characters" })
    .max(20, { message: "name must be at most 20 characters" }),

  email: z
    .string({ message: "email is required" })
    .email({ message: "invalid email" }),

  phone: z
    .string({ message: "Phone number is required" })
    .regex(/^(\+?\d{1,3}[- ]?)?\d{10}$/, {
      message: "Invalid phone number format",
    }),

  role: z
    .enum(["USER", "ADMIN"], {
      message: "role must be either 'user' or 'admin'",
    })
    .default("USER"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const verifySchema = z.object({
  otp: z
    .string()
    .min(1, { message: "OTP required" })
    .refine((value) => /^\d+$/.test(value), {
      message: "OTP must contain only numbers",
    }),
  password: z
    .string()
    .min(1, { message: "Password required" })
    .min(8, { message: "Password must be at least 8 charcters" }),
});

export type IVerifySchema = z.infer<typeof verifySchema>;



// export const loginSchema = z.object({
//   email: z.string().email({ message: 'Email is not valid' }),
//   password: z.string()
// })




export const loginSchema = z.object({
  email: z
    .string()
    .transform((val) => val.toLowerCase().replace(/\s+/g, ""))
    .refine((val) => val.includes("@"), { message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" }),
});

export type ILoginSchema = z.infer<typeof loginSchema>;
