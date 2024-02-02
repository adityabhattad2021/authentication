"use client";

import { UserInfo } from "@/components/auth/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";



export default function ClientPageExample() {
    const user = useCurrentUser();
    return (
        <div>
            <UserInfo
                label="Client Component Example"
                user={user}
            />
        </div>
    )
}