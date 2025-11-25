"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {ModeToggle} from  './Theme'
import LocaleSwitcher from './LocaleSwitcher';

const Navbar = ({children} : {children:React.ReactElement}) => {
    const t = useTranslations();
    const params = useParams();
    const locale = params.locale as string;

    return (
        <div className='flex items-center gap-4 rounded-lg p-1 border-gray-200 border-2 my-2'>
            <span className="block md:hidden">{children}</span>
            <span>{t('navbar.title')}</span>
            <Link href={`/${locale}/login`}>{t('navbar.login')}</Link>
            <Link href={`/${locale}/dashboard`}>{t('navbar.dashboard')}</Link>
            <LocaleSwitcher />
            <ModeToggle/>
        </div>
    );
};

export default Navbar;