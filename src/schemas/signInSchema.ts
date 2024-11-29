import {z} from "zod";

export const signInSchema = z.object({
    // we could write as email-username but it is prefered identifier at production level 
    identifier:z.string(),
    password: z.string()
})