import {z} from 'zod';

export const usernameValidation =  z
    .string()
    .min(2,"Username must be atleat 2 character long")
    .max(20, "Username must not be more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain a special character")


export const signUpSchema =  z.object({
    username: usernameValidation,
    email: z.string().email("Invalid email"),
    password: z.string().min(8,"Password must be at least 8 characters long"),
})