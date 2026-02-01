import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/app/(dashboard)/dashboard/components/DashboardSidebar"
import AdminGate from "@/components/AdminGate";
import Link from "next/link";
import {cn} from "@/lib/utils";
import Image from "next/image";

const LayoutDashboard = ({children}:{children:React.ReactNode}) => {
    return (
        <AdminGate>
        <SidebarProvider  style={
            {
                // "--sidebar-width": "75px",
                "--sidebar-width": "200px",
            } as React.CSSProperties
        }>
            <DashboardSidebar />
            <main className={'px-4 w-full overflow-x-auto'}>
                    <div className='md:hidden flex justify-between items-center'>
                        <SidebarTrigger className='md:hidden' />
                        <Link
                            href='/'
                            className={cn(
                                "flex flex-col items-center justify-center gap-2 px-3 py-2 transition-colors h-[65px]",
                            )}
                        >
                            <div className="relative w-6 h-8 md:w-12 md:h-14 block md:hidden">
                                <Image
                                    src="/images/logo-new.png"
                                    alt="logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                    </div>
                {children}
            </main>
        </SidebarProvider>
        </AdminGate>
    );
};

export default LayoutDashboard;




