import { IUser } from '@/pages/login'
import { deleteCookie, getCookie } from 'cookies-next'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import NavAdmin from './navAdmin'
import NavUser from './navUser'
import { useRouter } from 'next/router'

interface INavbarProps {
    onRefresh?: () => void
}

const Navbar = ({onRefresh}:INavbarProps) => {
    const [userData, setUserData] = useState<IUser | undefined>(undefined)
    const router = useRouter()

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
        if(router.pathname === "/") {
            onRefresh!()
        }
    }

    return (
        <header className='bg-[#112D4E]'>
            <div className='bg-[#112D4E] text-white py-4 max-w-7xl mx-auto flex justify-between items-center'>
            <h1 className='text-3xl font-bold'>NewzPortalz</h1>
            <div>
                <nav className='flex gap-x-7'>
                    {
                        userData ? userData.isAdmin ? <>
                            <NavAdmin />
                            <Link href="/" onClick={logoutHandler}>Logout</Link>
                        </> : <>
                            <NavUser />
                            <Link href="/" onClick={logoutHandler}>Logout</Link>
                        </> : <>
                            <Link href="/posts">Posts</Link>
                            <Link href="/login">Login</Link>
                        </>
                    }
                </nav>
            </div>
        </div>
        </header>
    )
}

export default Navbar