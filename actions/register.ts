"use server";
import { RegisterSchema } from "@/form-schema";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { EmailContent, EmailType, generateEmail, sendMail } from "@/utils/emails";


export async function register(values: z.infer<typeof RegisterSchema>) {
    const validateFields = RegisterSchema.safeParse(values);

    if (!validateFields.success) {
        return { error: "Invalid fields!" }
    }

    const { email, password, name } = validateFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.user.findUnique({
        where: {
            email,
        }
    })

    if (existingUser) {
        if (existingUser.emailVerified) {
            return { error: "This email is already taken" };
        } else {
            if (!existingUser.email) return;
            const verificationToken = await generateVerificationToken(existingUser.email);
            const emailContent: EmailContent = await generateEmail(EmailType.VERIFICATION_EMAIL, verificationToken.token);
            await sendMail(emailContent, [verificationToken.email]);
            return { success: "Confirmation email sent!" };
        }
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });

    const verificationToken = await generateVerificationToken(email);
    const emailContent: EmailContent = await generateEmail(EmailType.VERIFICATION_EMAIL, verificationToken.token);
    await sendMail(emailContent, [verificationToken.email]);

    return { success: "Confirmation email sent!" };
}