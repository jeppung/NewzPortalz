import { IUser } from '@/pages/login'
import { deleteCookie, getCookie } from 'cookies-next'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import NavAdmin from './navAdmin'
import NavUser from './navUser'

const Navbar = () => {
    const [userData, setUserData] = useState<IUser | undefined>(undefined)

    useEffect(() => {
        const cookieUser = getCookie("userData")
        if (cookieUser === undefined) {
            setUserData(undefined)
        } else {
            setUserData(JSON.parse(cookieUser) as IUser)
        }
    }, [])

    const logoutHandler = () => {
        deleteCookie("userData")
        setUserData(undefined)
    }

    return (
        <header className='bg-red-500 py-2 max-w-7xl mx-auto flex justify-between items-center'>
            <h1 className='text-3xl font-bold'>NewzPortalz</h1>
            <div>
                <nav className='flex space-x-5'>
                    {
                        userData ? userData.isAdmin ? <>
                            <NavAdmin />
                            <Link href="/" onClick={logoutHandler}>Logout</Link>
                        </> : <>
                            <NavUser />
                            <Link href="/" onClick={logoutHandler}>Logout</Link>
                        </> : <>
                            <NavUser />
                            <Link href="/login">Login</Link>
                        </>
                    }
                </nav>
            </div>
        </header>
    )
}

export default Navbar