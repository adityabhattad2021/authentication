import { db } from "@/lib/db";
import { TwoFactorConfirmation } from "@prisma/client";

export async function getTwoFactorConfirmationByUserId(userId: string): Promise<TwoFactorConfirmation | null> {
    try {
        const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
            where: {
                userId: userId
            }
        })
        return twoFactorConfirmation;
    } catch {
        return null;
    }
}