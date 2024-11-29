import React from 'react'
import Navbar from './Components/Navbar'
import { Outlet } from 'react-router-dom'
import './index.css'


const Layout = () => {
    return (
        <>
            <div className='bg-gray-200 min-h-[100vh] bg-fixed'>
                <Navbar />
                <Outlet />
            </div>
        </>
    )
}

export default Layout