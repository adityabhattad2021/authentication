import NextAuth, { type DefaultSession, type User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import authConfig from "./auth.config";
import { getUserById } from "./utils/user";


declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            role: string;
        };
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    // So that it automatically marks email verified on OAuth
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

            if (account?.provider !== "credentials") return true;

            console.log("HERE IS THE PROBLEM");

            if (!user.id) {
                return false;
            }
            const existingUser = await getUserById(user.id);
            if (!existingUser || !existingUser.emailVerified) {
                return false;
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
            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig
});