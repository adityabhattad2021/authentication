"use server";

import { NewPasswordSchema } from "@/form-schema";
import { db } from "@/lib/db";
import { getPasswordResetTokenByToken } from "@/utils/password-reset-token";
import { getUserByEmail } from "@/utils/user";
import bcrypt from "bcryptjs";
import * as z from "zod";


export async function setNewPassword(values: z.infer<typeof NewPasswordSchema>, token: string) {
    const validatedFields = NewPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid Fields!" }
    }

    const { password } = validatedFields.data;

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
        return { error: "Invalid token." }
    }

    const tokenHasExpired = new Date(existingToken.expires) < new Date();

    if (tokenHasExpired) {
        return { error: "Token has expired." };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: "User not found." }
    }

    if (existingUser.password === null) {
        return { error: "This account maybe linked to an OAuth Provider." }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.update({
        where: {
            email: existingToken.email,
        },
        data: {
            password: hashedPassword
        }
    });

    return { success: "Password updated successfully." }

}