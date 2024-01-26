import { getVerificationTokenByEmail } from "@/utils/verification-token";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";

export async function generateVerificationToken(email: string) {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 10 * 60 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const newVerificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return newVerificationToken;
}