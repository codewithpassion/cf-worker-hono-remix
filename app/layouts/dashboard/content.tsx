import {  Clock4 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "~/components/ui/card";

export default function Content() {
    return (<>                            <div className="p-4 w-full md:w-1/3">
        <Card>
            <CardHeader className="flex-row flex-wrap justify-between gap-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Announcements</CardTitle>
                <div className="flex gap-4">
                    <a href="#" className="block bg-gray-200 w-2 h-2 rounded-full"></a>
                    <a href="#" className="block bg-gray-200 w-2 h-2 rounded-full"></a>
                    <a href="#" className="block bg-black w-2 h-2 rounded-full"></a>
                    <a href="#" className="block bg-gray-200 w-2 h-2 rounded-full"></a>
                </div>
            </CardHeader>
            <CardContent>
                <CardTitle className="mb-2 text-xl">Lorem ipsum dolor sit amet</CardTitle>
                <CardDescription className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</CardDescription>
            </CardContent>
            <CardFooter className="flex-row flex-wrap justify-between gap-4">
                <div>
                    <CardTitle className="mb-0.5 text-sm font-medium">Due date</CardTitle>
                    <Badge variant="secondary" className="font-medium">30 September 2025</Badge>
                </div>
                <Button size="sm" className="text-xs">View Details</Button>
            </CardFooter>
        </Card>
    </div>
    <div className="p-4 w-full md:w-1/3">
        <Card>
            <CardHeader className="flex-row flex-wrap justify-between gap-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Schedule</CardTitle>
                <div className="flex gap-4">
                    <a href="#" className="block bg-gray-200 w-2 h-2 rounded-full"></a>
                    <a href="#" className="block bg-gray-200 w-2 h-2 rounded-full"></a>
                    <a href="#" className="block bg-black w-2 h-2 rounded-full"></a>
                    <a href="#" className="block bg-gray-200 w-2 h-2 rounded-full"></a>
                </div>
            </CardHeader>
            <CardContent>
                <CardTitle className="mb-2 text-xl">Weekly Stand-Up</CardTitle>
                <CardDescription className="flex items-center text-sm">
                    <Clock4 className="mr-1 w-4 h-4"></Clock4>16:15AM - 11:20PM
                </CardDescription>
            </CardContent>
            <CardFooter className="flex-row flex-wrap justify-between gap-4">
                <div>
                    <CardTitle className="mb-0.5 text-sm font-medium">Place</CardTitle>
                    <Badge variant="secondary" className="font-medium">Online Meeting</Badge>
                </div>
                <Button size="sm" className="text-xs">View Details</Button>
            </CardFooter>
        </Card>
    </div>
    <div className="p-4 w-full md:w-1/3">
        <Card className="py-6">
            <CardHeader className="items-center">
                <CardTitle className="mb-0.5 text-xl">Invite Friends</CardTitle>
                <CardDescription className="pb-5 text-sm">Lorem ipsum dolor sit amet</CardDescription>
                <Button size="sm" className="text-xs">Send Invitation</Button>
            </CardHeader>
        </Card>
    </div></>)
}