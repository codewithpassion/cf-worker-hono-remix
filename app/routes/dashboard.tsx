import { Outlet } from "@remix-run/react";
import { Suspense } from "react";
import { DashboardComponent } from "~/layouts/dashboard";
import { loader as authenticatedLoader } from "~/loaders/authenticated.loader.server"

export const loader = authenticatedLoader;

export default function Dashboard() {

    return (
        <DashboardComponent>
            <Suspense>
                <Outlet />
            </Suspense>
        </DashboardComponent>
    )
}
