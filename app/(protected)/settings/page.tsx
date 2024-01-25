import { auth } from "@/auth"

export default async function SettingsPage(){
    const session =await auth();
    console.log(session);
    
    return (
        <div>
            Settings
        </div>
    )
}