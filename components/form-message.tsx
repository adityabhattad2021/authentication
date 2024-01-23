import { cn } from "@/lib/utils";
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons";

interface FormMessageProps {
    message?: string;
    type: string;
}

export function FormMessage({
    message,
    type
}: FormMessageProps) {
    if (!message) return null;
    return (
        <div
            className={cn("p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive", 
            type === "success" ?
                "bg-emerald-500/15 text-emerald-500" : "bg-destructive/15 text-destructive"
            )}
        >
            {
                type === "success" && (
                    <CheckCircledIcon
                        className="h-4 w-4"
                    />
                )
            }
            {
                type === "error" && (
                    <ExclamationTriangleIcon
                        className="h-4 w-4"
                    />
                )
            }
            <p>
                {message}
            </p>
        </div>
    )
}