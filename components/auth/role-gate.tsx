"use client";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { FormMessage } from "../form-message";


interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: UserRole;
}


export function RoleGate({
    children,
    allowedRole
}: RoleGateProps) {

    const role = useCurrentRole();

    if (allowedRole === UserRole.ADMIN && role !== allowedRole) {
        return (
            <FormMessage
                type="error"
                message="You do not have permissions to access this page."
            />
        )
    }


    return (
        <>
            {children}
        </>
    )

}