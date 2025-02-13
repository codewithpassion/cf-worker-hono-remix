import { SidebarProvider, SidebarMenuButton, SidebarInset, SidebarTrigger } from "~/components/ui/sidebar";
import ProjectSidebar from "./sidebar";
import ProjectBreadcrumb from "./breadcrumb";
import Header from "./header";


export function DashboardComponent({children}: {children: React.ReactNode}) {
    return (
        <SidebarProvider>
            <ProjectSidebar />
            <SidebarInset>
                <div className="flex items-center justify-between w-full h-16 bg-secondary py-4 px-4 md:hidden">
                    <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">A</div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">Artemis</span>
                        </div>
                    </SidebarMenuButton>
                    <SidebarTrigger></SidebarTrigger>
                </div>
                <div data-bucket="1">
                    <div className="">
                        <div className="flex flex-wrap justify-between items-center gap-4 p-5 border-b">
                            <Header />
                        </div>
                        <div className="px-5 py-3">
                            <ProjectBreadcrumb />
                        </div>
                    </div>
                    <div className="py-4 px-4">
                        <div className="flex flex-wrap -m-4">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}