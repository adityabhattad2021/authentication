"use client";
import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession, signOut } from "next-auth/react";
import { useTransition } from "react";

export default function SettingsPage() {
    const user = useCurrentUser();
    const { update } = useSession();
    const [isPending, startTransition] = useTransition();

    function onClick() {
        startTransition(() => {
            settings({
                name: "New Name"
            }).then(() => {
                update();
            });
        })
    }

    return (
        <Card>
            <CardHeader>
                Settings
            </CardHeader>
            <CardContent>

            </CardContent>
        </Card>
    )
}