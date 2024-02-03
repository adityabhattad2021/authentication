"use client";

import { RoleGate } from "@/components/auth/role-gate";
import { FormMessage } from "@/components/form-message";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";

export default function AdminPage() {

    const role = useCurrentRole();

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Admin Page
                </p>
            </CardHeader>
            <CardContent>
                <RoleGate
                    allowedRole={UserRole.ADMIN}
                >
                    <FormMessage
                        type="success"
                        message="Protected Content"
                    />
                </RoleGate>
            </CardContent>
        </Card>
    )
}