"use client";

import { useTranslations } from 'next-intl';
import Link from "next/link";
import { useParams } from 'next/navigation';

const Page = () => {
    const t = useTranslations();
    const params = useParams();
    const locale = params.locale as string;

    return (
        <>
            <div>
                {t('dashboard.pageTitle')}
            </div>
            <Link href={`/${locale}`}>{t('common.back')}</Link>
        </>
    );
};

export default Page;