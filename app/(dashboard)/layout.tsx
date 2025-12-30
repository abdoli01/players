import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/app/(dashboard)/dashboard/components/DashboardSidebar"
import AdminGate from "@/components/AdminGate";

const LayoutDashboard = ({children}:{children:React.ReactNode}) => {
    return (
        <AdminGate>
        <SidebarProvider  style={
            {
                "--sidebar-width": "75px",
            } as React.CSSProperties
        }>
            <DashboardSidebar />
            <main className={'p-4 w-full'}>
                    <SidebarTrigger className='md:hidden' />
                {children}
            </main>
        </SidebarProvider>
        </AdminGate>
    );
};

export default LayoutDashboard;




