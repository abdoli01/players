import React from "react";
import Link from "next/link";
import {ModeToggle} from  './Theme'
import LocaleSwitcher from '@/components/LocaleSwitcher';
import {getTranslations} from 'next-intl/server';

export default async function Navbar ({children} : {children:React.ReactElement}) {
    const t = await  getTranslations ('Navbar');
    return (
        <div className='flex items-center gap-4 rounded-lg p-1 border-gray-200 border-2 my-2'>
            <span className="block md:hidden">{children}</span>
            <span>{t('navbar')}</span>
            <Link href="/login">{t('login')}</Link>
            <Link href="/dashboard">{t('dashboard')}</Link>
            <Link href="/profile">{t('profile')}</Link>
            <ModeToggle/>
            <LocaleSwitcher />
        </div>
    );
}

