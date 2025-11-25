import React from 'react';

const LayoutDashboard = ({children}:{children:React.ReactNode}) => {
    return (
        <div>
            <div className='w-full'>Header dashboard</div>
            {children}
            <div className='w-full'>Footer dashboard</div>
        </div>
    );
};

export default LayoutDashboard;