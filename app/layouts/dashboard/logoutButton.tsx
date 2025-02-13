import { LogOut } from "lucide-react";
import { Button } from "~/components/ui/button";

import { useFetcher } from "@remix-run/react";

export default function LogoutButton() {
    const fetcher = useFetcher();

    return (
    
    <fetcher.Form method="post" action="/logout">
        <Button type="submit" variant={'link'} className="px-2">
            <LogOut></LogOut>
            <span>Logout</span>
        </Button>
    </fetcher.Form>)
}