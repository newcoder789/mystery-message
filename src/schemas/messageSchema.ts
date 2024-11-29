import {z} from "zod";

export const messageSchema = z.object({
    content:z
    .string()
    .min(10,{message:"Content must be greater than 10 letters."})
    .max(300, {message:"Content must not be greater than 300 letters."})
})