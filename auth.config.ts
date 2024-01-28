// We have this file so that we can use edge, even though prisma doesn't works with edge.
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "./form-schema";
import { getUserByEmail } from "./utils/user";
import bcrypt from "bcryptjs";

export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {

                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await getUserByEmail(email);
                    if (!user || !user.password) {
                        return null;
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (isPasswordCorrect) {
                        return user;
                    }
                }
                return null;
            }
        })
    ],
} satisfies NextAuthConfig;