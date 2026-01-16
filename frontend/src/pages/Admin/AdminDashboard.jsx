import React from 'react'
import AdminSidebar from './Components/AdminSidebar'
import { Outlet } from 'react-router-dom'

const AdminDashboard = () => {
    return (
        <div className='w-full h-full'>
            <div className='flex'>
                <AdminSidebar />
                <div className='flex-1 w-full h-screen overflow-y-auto bg-gray-50/50 dark:bg-transparent'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard