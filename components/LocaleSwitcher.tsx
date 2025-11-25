"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LocaleSwitcher() {
    const pathname = usePathname();

    return (
        <div className="flex gap-4">
            <Link href={`/${pathname.split('/')[1] === 'fa' ? 'en' : 'fa'}${pathname.slice(3)}`}>
                {pathname.split('/')[1] === 'fa' ? '🇺🇸 English' : '🇮🇷 فارسی'}
            </Link>
        </div>
    );
}
