import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
});

export default function NotFound() {
    return (
        <div className="bg-sky-300 h-screen flex justify-center items-center flex-col">
            <h2 className={cn("p-3 text-3xl font-semibold text-white", font.className)}>Are you lost😁?</h2>
            <Link href="/settings">
                <Button>
                    Click here
                </Button>
            </Link>
        </div>
    )
}