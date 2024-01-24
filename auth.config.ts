// We have this file so that we can use edge, even though prisma doesn't works with edge.
import Credentials from "next-auth/providers/credentials";

import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "./schema";
import { getUserByEmail } from "./utils/user";
import bcrypt from "bcryptjs";

export default {
    providers:[
        Credentials({
            async authorize(credentials){

                const validatedFields = LoginSchema.safeParse(credentials);
                
                if(validatedFields.success){
                    const {email,password} = validatedFields.data;

                    const user = await getUserByEmail(email);
                    if(!user ||!user.password){
                        return null;
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if(isPasswordCorrect){
                        return user;
                    }
                }
                return null;
            }
        })
    ],
} satisfies NextAuthConfig;