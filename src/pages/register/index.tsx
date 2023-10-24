import Link from 'next/link'
import React, { useState } from 'react'
import { IError, IUser } from '../login'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { BASE_DB_URL } from '@/constants/url'



const Register = () => {
    const [user, setUser] = useState<Partial<IUser>>({})
    const [error, setError] = useState<IError | null>(null)
    const router = useRouter()

    const registerHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        user.subscription = {
            "type": "free",
            expiredAt: null
        }
        user.isAdmin = false
        user.readHistory = null
        user.statistic = {
            likes: {
                entertainment: 0,
                others: 0,
                politics: 0,
                sports: 0,
                technology: 0
            }
        }

        try {
            const res = await fetch(`${BASE_DB_URL}/users`, {
                method: "POST",
                body: JSON.stringify(user),
                headers: {
                    "Content-type": "application/json"
                }
            })
            if (!res.ok) return alert("An error has occured")

            const data = await res.json()
            setCookie("userData", data, {
                maxAge: 60 * 60
            })

            router.replace("/")
        } catch (e) {
            return alert("An error has occured")
        }
    }

    const checkPassword = (passwordC: string) => {
        if (passwordC !== user.password) {
            return setError({ status: true, message: "Password not match" })
        }
        return setError(null)
    }

    return (
        <main className='h-screen w-screen flex justify-center items-center bg-[#112D4E]'>
            <Head>
                <title>Newz Portalz | Register</title>
            </Head>
            <div className='bg-[#F9F7F7] w-96 p-5 rounded-xl'>
                <form action="#" className='flex flex-col gap-y-5' onSubmit={(e) => registerHandler(e)}>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="name" className='font-bold'>Name</label>
                        <input onChange={(e) => setUser({ ...user, name: e.target.value })} type="text" name="name" id="name" className='p-2 rounded-lg border-2' placeholder='John Doe' required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="phone" className='font-bold'>Phone</label>
                        <input onChange={(e) => setUser({ ...user, phone: parseInt(e.target.value) })} type="number" name="phone" id="phone" className='p-2 rounded-lg border-2' placeholder='081245237751' required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="address" className='font-bold'>Address</label>
                        <input onChange={(e) => setUser({ ...user, address: e.target.value })} type="text" name="address" id="address" className='p-2 rounded-lg border-2' placeholder='JL. Somewhere only you know' required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="email" className='font-bold'>Email</label>
                        <input onChange={(e) => setUser({ ...user, email: e.target.value })} type="email" name="email" id="email" className='p-2 rounded-lg border-2' placeholder='john.doe@mail.com' required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="password" className='font-bold'>Password</label>
                        <input onChange={(e) => setUser({ ...user, password: e.target.value })} type="password" name="password" id="password" className='p-2 rounded-lg border-2' placeholder='************' required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="passwordC" className='font-bold'>Password Confirmation</label>
                        <input onChange={(e) => checkPassword(e.target.value)} type="password" name="passwordC" id="passwordC" className='p-2 rounded-lg border-2' placeholder='************' required />
                    </div>
                    <button type='submit' className={`${error?.status ? "bg-slate-400" : "bg-[#112D4E] text-white"} w-full py-2 rounded-lg`} disabled={error?.status}>Register</button>
                    {error?.status && <p className='text-center text-sm'>{error.message}</p>}
                </form>
                <p className='text-center mt-10 text-sm'>Already have an account? <Link href="/login" className='font-bold'>Login Here</Link></p>
            </div>
        </main>
    )
}

export default Register