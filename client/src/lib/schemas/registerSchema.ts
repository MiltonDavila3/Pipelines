import z from "zod";

const passwordRegex = new RegExp(
    /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/
)
export const registerSchema = z.object({
    email: z.string(),
    password: z.string().regex(passwordRegex, {
    message: 'Password must contain 1 lowercase character, 1 uppercase character, 1 number, 1 special and be 6-10 characters'}),
});

export type RegisterSchema = z.infer<typeof registerSchema>;