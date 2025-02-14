import { SidebarProvider, SidebarMenuButton, SidebarInset, SidebarTrigger } from "~/components/ui/sidebar";
import ProjectSidebar from "./sidebar";
import ProjectBreadcrumb from "./breadcrumb";
import Header from "./header";
import { Component, ErrorInfo, ReactNode } from "react";

class DashboardErrorBoundary extends Component<
    { children: ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Dashboard Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
                    <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
                    <p className="text-muted-foreground mb-4">
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export function DashboardComponent({ children }: { children: React.ReactNode }) {
    return (
        <DashboardErrorBoundary>
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
        </DashboardErrorBoundary>
    )
}
