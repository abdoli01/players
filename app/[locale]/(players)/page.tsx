import {use} from 'react';
import { useTranslations } from 'next-intl';
import {setRequestLocale} from 'next-intl/server';

export default function Home({params}) {
    const {locale} = use(params);

    // ضروری برای static rendering + انتقال locale
    setRequestLocale(locale);

    const t = useTranslations('HomePage');

    return (
        <>
            <div className={'font-bold text-amber-700'}>
                سلام
            </div>
            <div className={'font-bold text-xl'}>Home</div>
            <h1>{t('title')}</h1>
        </>
    );
}
