"use client";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { LoginForm } from "./login-form";

interface LoginButtonProps {
    children: React.ReactNode;
    asChild?: boolean;
}

export default function LoginButton({
    children,
}: LoginButtonProps) {
    const router = useRouter();

    function onClick() {
        router.push('/auth/login');
    }

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}