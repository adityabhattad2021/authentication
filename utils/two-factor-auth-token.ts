import { db } from "@/lib/db";

export async function getTwoFactorAuthTokenByEmail(email:string){
    try{
        const twoFactorAuthToken = await db.twoFactorToken.findFirst({
            where:{
                email:email
            }
        });
        return twoFactorAuthToken;
    }catch{
        return null;
    }
}

export async function getTwoFactorAuthTokenByToken(token:string){
    try{
        const twoFactorAuthToken = await db.twoFactorToken.findFirst({
            where:{
                token:token
            }
        })
        return twoFactorAuthToken;
    }catch{
        return null;
    }
}