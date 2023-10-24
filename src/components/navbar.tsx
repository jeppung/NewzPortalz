import { IUser } from '@/pages/login'
import { deleteCookie, getCookie } from 'cookies-next'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import NavAdmin from './navAdmin'
import NavUser from './navUser'
import { useRouter } from 'next/router'
import Image from 'next/image'

interface INavbarProps {
    onRefresh?: () => void
}

const Navbar = ({ onRefresh }: INavbarProps) => {
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
        const isConfirm = confirm("Are you sure want to log out ?")
        if (!isConfirm) return

        deleteCookie("userData")
        setUserData(undefined)
        router.replace("/")

        if (router.pathname === "/") {
            onRefresh!()
        }
    }

    return (
        <header className='bg-[#112D4E]'>
            <div className='bg-[#112D4E] text-white py-4 max-w-7xl px-5 md:px-0 mx-auto flex flex-col md:flex-row justify-between items-center'>
                <Image src={"/newzportalz_logo.png"} width={100} height={100} alt='logo' className='hover:cursor-pointer' onClick={() => router.push("/")} />
                <div className='mt-3 md:mt-0 lg:flex'>
                    <nav className='flex gap-x-7'>
                        {
                            userData ? userData.isAdmin ? <>
                                <NavAdmin />
                                <button onClick={logoutHandler}>Logout</button>
                            </> : <>
                                <NavUser />
                                <button onClick={logoutHandler}>Logout</button>
                            </> : <>
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