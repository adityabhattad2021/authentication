"use client";
import { useRouter } from "next/navigation";

interface LoginButtonProps {
    children:React.ReactNode;
    mode:"modal" | "redirect";
    asChild?:boolean;
}

export default function LoginButton({
    children,
    mode="redirect",
    asChild
}:LoginButtonProps){

    const router = useRouter();

    function onClick(){
        router.push('/auth/login');
    }

    if(mode==="modal"){
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