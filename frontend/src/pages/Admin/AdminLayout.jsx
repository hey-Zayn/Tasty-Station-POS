import React from 'react'
import AdminSidebar from './Components/AdminSidebar'
import { Outlet } from 'react-router-dom'


const AdminLayout = () => {
    return (
        <div className='w-full flex flex-col bg-background'>


            {/* Main Layout Area */}
            <div className='flex flex-1'>
                {/* Sidebar */}
                <div className="flex-none border-r">
                    <AdminSidebar />
                </div>

                {/* Scrollable Content area */}
                <div className='flex-1 w-full h-full bg-gray-50/50 dark:bg-transparent custom-scrollbar'>
                    <div className="p-0"> {/* Container for content padding if needed */}
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLayout
