import Counter from "@/components/Counter";
import { useTranslations } from 'next-intl';
export default function Home() {
    const t = useTranslations('HomePage');
  return (
     <>
         <div className={'font-bold text-amber-700'}>
             سلام
         </div>
         <div className={'font-bold text-xl'}>Home</div>
         <Counter/>
         <h1>{t('title')}</h1>


     </>
  );
}