"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const tabs = [
        { title: "Profile", url: "/profile" },
        { title: "Reports", url: "/reports" },
        { title: "Videos", url: "/videos" },
    ];

    const isActive = (url: string) => pathname.startsWith(url);

    return (
        <div className="w-full px-6 py-2 flex items-end justify-between bg-black text-white border-b-2 border-[#2c2c2c]">
            {/* LEFT: Player Info */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-400" />
                <div className="flex flex-col leading-tight">
                    <span className="font-semibold text-lg">Serdar Durson</span>
                    <span className="text-sm text-gray-400">Persepolis | #09 | 29yo</span>
                </div>
            </div>

            {/* RIGHT: Tabs */}
            <div className="flex items-center text-sm font-medium">
                {tabs.map(({ title, url }) => (
                    <Link href={url} key={title} className="relative cursor-pointer">
            <span
                className={

                `${    isActive(url)
                    ? "text-orange-400"
                    : "text-gray-300 hover:text-white transition"} px-8`
                }
            >
              {title}
            </span>

                        {isActive(url) && (
                            <div className="absolute left-0 -bottom-2.5 w-full h-[2px] bg-orange-400 rounded-full" />
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
