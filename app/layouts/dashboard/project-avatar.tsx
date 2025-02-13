
import { Link, useLocation } from "@remix-run/react";
import { ChevronsUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";


export default function ProjectAvatar() {
    const location = useLocation();
    const isProjectPage = /^\/dashboard\/project\/[^/]+$/.test(location.pathname);

    if (!isProjectPage) return <div className="gap-3"></div>;

    return (<>
        <Link to="#" className="flex items-center gap-3">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"></AvatarImage>
                <AvatarFallback>PN</AvatarFallback>
            </Avatar>
            <h3 className="text-sm">Your Project Name</h3>
            <ChevronsUpDown className="w-4 h-4"></ChevronsUpDown>
        </Link>
    </>);
}
