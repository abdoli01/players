"use client";

import { useTranslations } from 'next-intl';

const Settings = () => {
    const t = useTranslations();
    
    return (
        <div>
            {t('pages.settings')}
        </div>
    );
};

export default Settings;
