import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
    const session = await auth();

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