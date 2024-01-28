"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/utils/user";
import { getVerificationTokenByToken } from "@/utils/verification-token";


export async function verifyEmail(token: string) {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return { error: "Token does not exists!" }
    }

    const tokenHasExpired = new Date(existingToken.expires) < new Date();

    if (tokenHasExpired) {
        return { error: "Token has expired!" }
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: "Invalid token!" }
    }

    await db.user.update({
        where: {
            id: existingUser.id,
        },
        data: {
            emailVerified: new Date(),
            email: existingToken.email,
        }
    });

    await db.verificationToken.delete({
        where: {
            id: existingToken.id
        }
    })

    return { success: "Successfully verified the email!" }
}