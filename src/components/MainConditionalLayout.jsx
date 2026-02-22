'use client'


import React from 'react'
import AuthProvider from './AuthProvider'
import { usePathname } from 'next/navigation'
import Navbar from './sections/Navbar'
import Footer from './sections/Footer'

export const MainConditionalLayout = ({children}) => {


    const pathname = usePathname()
    const isDashboard = pathname.startsWith("/dashboard")

  return (
    <div>
        <AuthProvider>
            {!isDashboard && <Navbar/>}
            {children}
            {!isDashboard && <Footer/>}
        </AuthProvider>
    </div>
  )
}
