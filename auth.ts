import NextAuth, { type DefaultSession, type User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import authConfig from "./auth.config";
import { getUserById } from "./utils/user";
import { getTwoFactorConfirmationByUserId } from "./utils/two-factor-confirmation";


export type ExtendedUser = DefaultSession["user"] & {
    role: string;
    isTwoFactorEnabled: boolean
}


declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    // So that it automatically marks email verified on OAuth
    pages: {
        signIn: "/auth/login",
        error: "/auth/error"
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    emailVerified: new Date(),
                }
            })
        }
    },
    callbacks: {
        async signIn({ user, account }) {

            if (account?.provider !== "credentials") {
                return true;
            }

            if (!user.id) {
                return false;
            }
            const existingUser = await getUserById(user.id);


            if (!existingUser || !existingUser.emailVerified) {
                return false;
            }

            if (existingUser?.isTwoFactorEnabled) {
                const twoFactorConfiramtion = await getTwoFactorConfirmationByUserId(user.id);
                if (!twoFactorConfiramtion) {
                    return false;
                }
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: twoFactorConfiramtion.id
                    }
                })
            }

            return true;
        },
        async session({ token, session }) {
            if (token?.sub && session?.user) {
                session.user.id = token.sub;
            }
            if (token?.role && session?.user) {
                session.user.role = token.role;
            }
            if (session?.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
            }
            return session;
        },
        async jwt({ token }) {
            if (!token.sub) {
                return token;
            }
            const existingUser = await getUserById(token.sub);
            if (!existingUser) {
                return token;
            }
            token.role = existingUser.role;
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig
});