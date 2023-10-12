import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <header className='bg-red-500 max-w-7xl mx-auto flex justify-between items-center'>
            <h1 className='text-3xl font-bold'>NewzPortalz</h1>
            <nav>
                <Link href="/login">Login</Link>
            </nav>
        </header>
    )
}

export default Navbar