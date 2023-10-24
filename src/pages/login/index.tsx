import { BASE_DB_URL } from '@/constants/url'
import { setCookie } from 'cookies-next'
import moment from 'moment'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

export interface IError {
    message: string,
    status: boolean
}

interface ISubscription {
    type: "free" | "premium"
    expiredAt: string | null
}

export interface IReadHistory {
    id?: number
    slug: string
    isLike: boolean
    isShare: boolean
    createdAt: string
    updatedAt: string
}

export type PostCategory = "technology" | "entertainment" | "politics" | "sports" | "others"

interface IStatisticLikes {
    technology: number
    entertainment: number
    politics: number
    sports: number
    others: number
}

export interface IUser {
    id?: number
    name: string
    email: string
    password: string
    address: string
    phone: number
    subscription: ISubscription
    statistic: {
        likes: IStatisticLikes
    }
    readHistory: IReadHistory[] | null
    isAdmin: boolean
}


const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<IError | null>(null)
    const router = useRouter()

    const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        try {
            const res = await fetch(`${BASE_DB_URL}/users?email=${email}&password=${password}`)
            if (!res.ok) {
                return setError({ status: true, message: "An error occured" })
            }

            const data = await res.json() as IUser[]
            if (data.length === 0) return setError({ status: true, message: "Email/password is invalid" })

            const isExpired = moment(new Date()).isAfter(data[0].subscription.expiredAt)
            if (isExpired) {
                data[0].subscription.expiredAt = null
                data[0].subscription.type = "free"
            }

            setCookie("userData", data[0], {
                maxAge: 60 * 60
            })
            data[0].isAdmin ? router.push({ pathname: "/admin/posts", query: { isLogin: true } }, "/admin/posts") : router.push({ pathname: "/", query: { isLogin: true } }, "/")
        } catch (e) {
            return setError({ status: true, message: "An error occured" })
        }
    }

    return (
        <main className='h-screen w-screen flex justify-center items-center bg-[#112D4E]'>
            <Head>
                <title>Newz Portalz | Login</title>
            </Head>
            <div className='bg-[#F9F7F7] w-96 p-5 rounded-xl'>
                <form action="#" className='flex flex-col gap-y-5' onSubmit={(e) => loginHandler(e)}>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="email" className='font-bold'>Email</label>
                        <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className='p-2 rounded-lg border-2' placeholder='john.doe@mail.com' required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="password" className='font-bold'>Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" className='p-2 rounded-lg border-2' placeholder='************' required />
                    </div>
                    <button type='submit' className='bg-[#112D4E] text-white w-full py-2 rounded-lg'>Log In</button>
                    {error?.status && <p className='text-center text-sm'>{error.message}</p>}
                </form>
                <p className='text-center mt-10 text-sm'>Not registered yet? <Link href="/register" className='font-bold'>Register Here</Link></p>
            </div>
        </main>

    )
}

export default Login