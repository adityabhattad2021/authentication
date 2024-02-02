"use client";
import { FaUser } from "react-icons/fa";
import { ExitIcon } from "@radix-ui/react-icons";
import { useCurrentUser } from "@/hooks/use-current-user";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogoutButton } from "./logout-button";


export function UserButton() {
    const user = useCurrentUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage
                        src={user?.image || ""}
                    />
                    <AvatarFallback>
                        <FaUser />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <LogoutButton
                    mode="redirect"
                >
                    <DropdownMenuItem>
                        <ExitIcon className="h-4 w-4 mr-2" />
                        Logout
                    </DropdownMenuItem>

                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}