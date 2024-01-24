// We have this file so that we can use edge, even though prisma doesn't works with edge.
import Google from "next-auth/providers/google";

import type { NextAuthConfig } from "next-auth";

export default {
    providers:[Google],
} satisfies NextAuthConfig;