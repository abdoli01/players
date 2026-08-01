import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import Navbar from "@/components/Navbar";
import AuthGate from "@/components/AuthGate";
import RoleGate from "@/components/RoleGate";
import { ROLES } from "@/constants/roles";
export default function PlayersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGate>
            <RoleGate
                allowedRoles={[
                    ROLES.PLAYER,
                    ROLES.OUTFIELD,
                    ROLES.GOALKEEPER,
                ]}
                loginRedirect="/login"
                unauthorizedRedirect="/dashboard/users"
            >
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "75px",
                    } as React.CSSProperties
                }
            >
                <AppSidebar />
                <main className={'px-4 w-full'}>
                    <Navbar>
                        <SidebarTrigger />
                    </Navbar>
                    {children}
                </main>
            </SidebarProvider>
            </RoleGate>
        </AuthGate>
    );
}

