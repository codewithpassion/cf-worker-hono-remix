import { House, List } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "~/components/ui/breadcrumb";

export default function ProjectBreadcrumb() {
    return null;
    return (<Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
                <House className="w4 h-4"></House>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator></BreadcrumbSeparator>
            <BreadcrumbItem>
                <List className="w4 h-4"></List>
                <BreadcrumbPage>Data List</BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
    </Breadcrumb>
    );
}