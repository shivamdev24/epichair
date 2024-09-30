import {z} from 'zod'


export const signupSchema = z.object({
    email: z.string().email({message : "Invalid Email Address"}),
    password: z.string().min(6, {message: "password must be at least 6 characters"})
})