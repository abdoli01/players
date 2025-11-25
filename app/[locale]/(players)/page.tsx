"use client";

import { useTranslations } from 'next-intl';
import Counter from "@/components/Counter";

export default function Home() {
  const t = useTranslations();
  
  return (
     <>
         <div className={'font-bold text-amber-700'}>
             {t('home.greeting')}
         </div>
         <div className={'font-bold text-xl'}>{t('home.title')}</div>
         <Counter/>
     </>
  );
}
