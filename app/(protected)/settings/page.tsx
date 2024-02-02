import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

export default function SettingsPage() {
    const { data: session } = useSession();

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