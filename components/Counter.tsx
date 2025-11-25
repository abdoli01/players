"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { increment, decrement, increaseBy } from "@/store/slices/counterSlice";

export default function Counter() {
    const value = useAppSelector((state) => state.counter.value);
    const dispatch = useAppDispatch();

    return (
        <div>
            <h1>Counter: {value}</h1>

            <button className={'mx-2.5'} onClick={() => dispatch(increment())}>+</button>
            <button className={'mx-2.5'} onClick={() => dispatch(decrement())}>-</button>

            <button className={'mx-2.5'} onClick={() => dispatch(increaseBy(5))}>
                +5
            </button>
        </div>
    );
}
