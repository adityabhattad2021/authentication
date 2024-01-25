import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    
    
    return (
        <div>
            <LoginForm />
        </div>
    )
}