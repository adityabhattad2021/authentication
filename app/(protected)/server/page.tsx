import { auth } from "@/auth"
import { UserInfo } from "@/components/auth/user-info";

export default async function ServerPage() {
    const session = await auth();
    console.log(session);
    
    return (
        <UserInfo
            label="Server Component Example"
            user={session?.user}
        />
    )
}