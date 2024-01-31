import { getVerificationTokenByEmail } from "@/utils/verification-token";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { db } from "./db";
import { getPasswordResetTokenByEmail } from "@/utils/password-reset-token";
import { getTwoFactorAuthTokenByEmail } from "@/utils/two-factor-auth-token";
import { TwoFactorToken } from "@prisma/client";

export async function generateTwoFactorAuthToken(email:string):Promise<TwoFactorToken>{
    const token = crypto.randomInt(100_000,1_000_000).toString();
    const expires = new Date(new Date().getTime()+1*60*1000);

    const existingToken = await getTwoFactorAuthTokenByEmail(email);
    if(existingToken){
        await db.twoFactorToken.delete({
            where:{
                id:existingToken.id
            }
        })
    }

    const newTwoFactorAuthToken = await db.twoFactorToken.create({
        data:{
            email,
            token,
            expires
        }
    })

    return newTwoFactorAuthToken;
}

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


export async function generatePasswordResetToken(email: string) {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 10 * 60 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);
    if (existingToken) {
        await db.passwordResetToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const newPasswordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return newPasswordResetToken;
}