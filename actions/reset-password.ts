"use server";

import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetPasswordSchema } from "@/schema";
import { EmailContent, EmailType, generateEmail, sendMail } from "@/utils/emails";
import { getUserByEmail } from "@/utils/user";
import * as z from "zod";




export async function reset(values: z.infer<typeof ResetPasswordSchema>) {
    const validatedFields = ResetPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" }
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser?.email) {
        return { error: "Email not found." }
    }

    const resetPasswordToken = await generatePasswordResetToken(existingUser.email);
    const emailContent: EmailContent = await generateEmail(EmailType.PASSWORD_RESET_EMAIL, resetPasswordToken.token);
    await sendMail(emailContent, [resetPasswordToken.email]);

    return { success: "Reset password email sent!" }
}