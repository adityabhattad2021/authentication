"use server";
import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { generateTwoFactorAuthToken, generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/form-schema";
import { EmailContent, EmailType, generateEmail, sendMail } from "@/utils/emails";
import { getUserByEmail } from "@/utils/user";
import { AuthError } from "next-auth";
import * as z from "zod";
import { getTwoFactorAuthTokenByEmail } from "@/utils/two-factor-auth-token";
import { getTwoFactorConfirmationByUserId } from "@/utils/two-factor-confirmation";

export async function login(values: z.infer<typeof LoginSchema>, callBackUrl: string | null) {

    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" }
    }

    const { email, password, code } = validatedFields.data;

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

    if (existingUser.isTwoFactorEnabled) {
        if (code) {
            const twoFactorToken = await getTwoFactorAuthTokenByEmail(existingUser.email);

            if (!twoFactorToken) {
                return { error: "Invalid code" }
            }

            if (twoFactorToken.token.toString() !== code.toString()) {
                return { error: "Invalid code" }
            }

            const hasExpried = new Date(twoFactorToken.expires) < new Date();
            if (hasExpried) {
                return { error: "Code expired." }
            }
            await db.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id
                }
            });
            const existingConfirmationToken = await getTwoFactorConfirmationByUserId(existingUser.id);
            if (existingConfirmationToken) {
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: existingConfirmationToken.id
                    }
                });
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            });

        } else {
            const twoFactorToken = await generateTwoFactorAuthToken(existingUser.email);
            const emailContent: EmailContent = await generateEmail(EmailType.TWO_FACTOR_AUTHENTICATION_EMAIL, twoFactorToken.token);
            await sendMail(emailContent, [twoFactorToken.email]);
            return { twoFactorTokenSent: true };
        }
    }
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++", callBackUrl);

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callBackUrl || DEFAULT_LOGIN_REDIRECT
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