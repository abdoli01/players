import React from "react";
import Link from "next/link";
import {ModeToggle} from  './Theme'
import LocaleSwitcher from '@/components/LocaleSwitcher';

const Navbar = ({children} : {children:React.ReactElement}) => {
    return (
        <div className='flex items-center gap-4 rounded-lg p-1 border-gray-200 border-2 my-2'>
            <span className="block md:hidden">{children}</span>
            <span>نوبار</span>
            <Link href="/login">ورود</Link>
            <Link href="/dashboard">داشبورد</Link>
            <ModeToggle/>
            <LocaleSwitcher />
        </div>
    );
};

export default Navbar;