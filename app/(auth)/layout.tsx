import React from "react";
import GuestGate from "@/components/GuestGate";


export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <GuestGate>{children}</GuestGate>;
}
