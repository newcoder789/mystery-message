import {z} from "zod";

export const verifySchema = z.object({
    code: z.string().length(6,{message:"Verification code should be  exactly 6 characters long."})
})