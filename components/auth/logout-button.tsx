"use client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react"

interface LogoutButtonProps {
    children: React.ReactNode;
    mode: "modal" | "redirect";
    asChild?: boolean
}

export function LogoutButton(
    {
        children,
        mode = "redirect",
        asChild
    }: LogoutButtonProps
) {
    const router = useRouter();

    function onClick() {
        signOut();
    }

    if (mode === "modal") {
        return (
            <div>
                TODO: Add Modal
            </div>
        )
    }

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}