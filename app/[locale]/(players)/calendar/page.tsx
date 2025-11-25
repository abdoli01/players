"use client";

import { useTranslations } from 'next-intl';

const Calendar = () => {
    const t = useTranslations();
    
    return (
        <div>
            {t('pages.calendar')}
        </div>
    );
};

export default Calendar;
