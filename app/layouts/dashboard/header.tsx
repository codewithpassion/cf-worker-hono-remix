import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { Link } from "@remix-run/react";
import { ChevronsUpDown, MessageSquare, Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import ProjectAvatar from "./project-avatar";
import UserAvatar from "./user-avatar";



export default function Header() {
    return (<>
    <ProjectAvatar />
    <Input type="email" placeholder="Type to search..." className="max-w-max"></Input>
        <div className="flex flex-wrap gap-6">
            <NavigationMenu>
                {/* <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/docs" legacyBehavior={true} passHref={true}>
                            <NavigationMenuLink className="null">
                                <MessageSquare className="w-5 h-5"></MessageSquare>
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/docs" legacyBehavior={true} passHref={true}>
                            <NavigationMenuLink className="null">
                                <Bell className="w-5 h-5"></Bell>
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList> */}
            </NavigationMenu>
            <UserAvatar />

        </div></>)
}