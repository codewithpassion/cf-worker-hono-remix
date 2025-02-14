import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { NavLink } from "@remix-run/react";
import { Gauge, Globe, ChevronDown, ContactRound, Info, Inbox, FolderOpen, List, Settings, Truck } from "lucide-react";
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarFooter } from "~/components/ui/sidebar";
import LogoutButton from "~/layouts/dashboard/logoutButton";

export default function ProjectSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild={true}>
                                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">A</div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">WebAssistant</span>
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>MAIN</SidebarGroupLabel>
                    <SidebarMenu>
                        <Collapsible asChild={true} defaultOpen={false} className="group/collapsible">
                            <SidebarMenuItem>
                            <NavLink to="/dashboard">
                                <SidebarMenuButton tooltip="tooltip">
                                    <Gauge></Gauge>
                                    <span>Dashboard</span>
                                </SidebarMenuButton>
                            </NavLink>
                            </SidebarMenuItem>
                        </Collapsible>
                        <Collapsible asChild={true} defaultOpen={false} className="group/collapsible">
                            <SidebarMenuItem>
                                <NavLink to="/dashboard/trucks">
                                    <SidebarMenuButton tooltip="tooltip">
                                        <Truck />
                                        <span>Trucks</span>
                                    </SidebarMenuButton>
                                </NavLink>

                            </SidebarMenuItem>
                        </Collapsible>
                            <SidebarMenuItem>
                                    <NavLink to="/dashboard/addresses">
                                    <SidebarMenuButton tooltip="tooltip">
                                        <ContactRound></ContactRound>
                                        <span>Addresses</span>
                                    </SidebarMenuButton>
                                    </NavLink>
                            </SidebarMenuItem>

                        {/* <Collapsible asChild={true} defaultOpen={false} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild={true}>
                                    <NavLink to="/dashboard/addresses">
                                    <SidebarMenuButton tooltip="tooltip">
                                        <ContactRound></ContactRound>
                                        <span>Addresses</span>
                                    </SidebarMenuButton>
                                    </NavLink>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton asChild={true}>
                                                <button type="button">
                                                    <span>Item 1</span>
                                                </button>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible> */}

                    </SidebarMenu>
                </SidebarGroup>
                {false && (
                <SidebarGroup>
                    <SidebarGroupLabel>SECONDARY</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild={true}>
                                <button type="button">
                                    <Info></Info>
                                    <span>Support Center</span>
                                </button>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild={true}>
                                <button type="button">
                                    <Inbox></Inbox>
                                    <span>Inbox</span>
                                </button>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild={true}>
                                <button type="button">
                                    <FolderOpen></FolderOpen>
                                    <span>File Manager</span>
                                </button>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild={true}>
                                <button type="button">
                                    <List></List>
                                    <span>Data List</span>
                                </button>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                )}
            </SidebarContent>
            {false && (
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild={true}>
                            <button type="button">
                                <Settings></Settings>
                                <span>Settings</span>
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild={true}>
                            <LogoutButton />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        )}
        </Sidebar>
    );
}
