"use client";

import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

const LayoutDashboard = ({children}:{children:ReactNode}) => {
    const t = useTranslations();
    
    return (
        <div>
            <div className='w-full'>{t('dashboard.header')}</div>
            {children}
            <div className='w-full'>{t('dashboard.footer')}</div>
        </div>
    );
};

export default LayoutDashboard;