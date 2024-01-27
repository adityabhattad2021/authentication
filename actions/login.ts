"use server";
import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schema";
import { EmailContent, EmailType, generateEmail, sendMail } from "@/utils/emails";
import { getUserByEmail } from "@/utils/user";
import { AuthError } from "next-auth";
import * as z from "zod";

export async function login(values: z.infer<typeof LoginSchema>) {

    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" }
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Invalid Credentails!" };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        const emailContent: EmailContent = await generateEmail(EmailType.VERIFICATION_EMAIL, verificationToken.token);
        await sendMail(emailContent, [verificationToken.email]);
        return { success: "Confirmation email sent!" };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid Credentials" }
                default:
                    return { error: "Something went wrong!" }
            }
        }
        throw error;
    }
    return { success: "Successfully logged in!" }
}