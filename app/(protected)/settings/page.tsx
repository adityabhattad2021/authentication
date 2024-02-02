"use client";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession, signOut } from "next-auth/react";

export default function SettingsPage() {
    const user = useCurrentUser();

    return (
        <div className="flex h-screen justify-center items-center">
            <form action={async () => {
                "use server";

                await signOut();
            }}>
                <Button type="submit">
                    Sign Out
                </Button>
            </form>
        </div>
    )
}