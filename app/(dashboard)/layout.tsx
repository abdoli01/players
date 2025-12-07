import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/app/(dashboard)/dashboard/components/DashboardSidebar"

const LayoutDashboard = ({children}:{children:React.ReactNode}) => {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <main className={'px-4 w-full'}>
                    <SidebarTrigger className='md:hidden' />
                {children}
            </main>
        </SidebarProvider>
    );
};

export default LayoutDashboard;




