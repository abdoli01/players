import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import Navbar from "@/components/Navbar";

export default function PlayersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "75px",
                    "--sidebar-width-mobile": "20rem",
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
    );
}

