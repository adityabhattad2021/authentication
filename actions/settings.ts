"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { SettingsSchema } from "@/form-schema";
import { auth } from "@/auth";
import { getUserById } from "@/utils/user";




export async function settings(
    values: z.infer<typeof SettingsSchema>
) {
    const session = await auth();
    const currentUser = session?.user;

    if (!currentUser) {
        return { error: "Unauthorized" };
    }

    if (currentUser.id) {
        const dbUser = await getUserById(currentUser.id);
        if (!dbUser) {
            return { error: "Unauthorized" };
        }
        await db.user.update({
            where: {
                id: dbUser.id
            },
            data: {
                ...values
            }
        })
        return { success: "Settings Updated." };

    } else {
        return { error: "Unauthorized" };
    }

}