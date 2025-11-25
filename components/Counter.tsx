"use client";

import { useTranslations } from 'next-intl';
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { increment, decrement, increaseBy } from "@/store/slices/counterSlice";

export default function Counter() {
    const t = useTranslations();
    const value = useAppSelector((state) => state.counter.value);
    const dispatch = useAppDispatch();

    return (
        <div>
            <h1>{t('counter.title')}: {value}</h1>

            <button className={'mx-2.5'} onClick={() => dispatch(increment())}>+</button>
            <button className={'mx-2.5'} onClick={() => dispatch(decrement())}>-</button>

            <button className={'mx-2.5'} onClick={() => dispatch(increaseBy(5))}>
                +5
            </button>
        </div>
    );
}
