"use client";

import { useTranslations } from 'next-intl';

const Inbox = () => {
    const t = useTranslations();
    
    return (
        <div>
            {t('pages.inbox')}
        </div>
    );
};

export default Inbox;
