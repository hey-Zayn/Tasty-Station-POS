import React from 'react'
import Sidebar from './components/Sidebar'

const Dashboard = () => {
    return (
        <div className='flex'>
            <Sidebar />
            <div className='flex-1'>Dashboard</div>
        </div>
    )
}

export default Dashboard