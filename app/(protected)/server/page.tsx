import { auth } from "@/auth"
import { UserInfo } from "@/components/auth/user-info";

export default async function ServerPage() {
    const session = await auth();
    return (
        <UserInfo
            label="Server Component Example"
            user={session?.user}
        />
    )
}