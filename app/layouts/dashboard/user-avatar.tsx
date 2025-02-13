import { Link, useLoaderData } from "@remix-run/react";
import { ChevronDown, LogOut, Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "~/components/theme-provider";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { md5 } from 'js-md5'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "~/components/ui/dropdown-menu";
import LogoutButton from "./logoutButton";


type LoaderData = {
    user: {
        email: string;
        name?: string;
    };
};


export default function UserAvatar() {
    const { user } = useLoaderData<LoaderData>();
    const { setTheme, theme } = useTheme();

    const [avatarError, setAvatarError] = useState<boolean>(false);

    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : user.email.substring(0, 2).toUpperCase();

    const size = 40;

    const imgUrls = useMemo(() => {
        const hash = md5(user.email);
        const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${size * 2}&d=404`;
        const uiAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "")}`;

        return { gravatarUrl, uiAvatarUrl };

    }, [user.email, user.name])

    // Handle image load errors
    const handleImageError = () => {
        setAvatarError(true);
    };

    const imgUrl = avatarError ? imgUrls.uiAvatarUrl : imgUrls.gravatarUrl;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
                <Avatar>
                    <AvatarImage src={user.email ? imgUrl : undefined} alt={user.name || user.email} onError={handleImageError}></AvatarImage>
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <h3 className="text-sm">{user.name || user.email}</h3>
                <ChevronDown className="w-4 h-4"></ChevronDown>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">


                {theme === "dark" ? (<DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                </DropdownMenuItem>) : (<DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                </DropdownMenuItem>)}



                <DropdownMenuSeparator />


                <DropdownMenuItem asChild>
                    
                    <LogoutButton />
                    
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>);
}
