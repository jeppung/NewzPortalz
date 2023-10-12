import { setCookie } from 'cookies-next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

export interface IError {
    message: string,
    status: boolean
}

export interface IUser {
    id?: number
    name: string
    email: string
    password: string
    address: string
    phone: number
    subscription: string
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
            const res = await fetch(`http://localhost:6969/auth/login?email=${email}&password=${password}`)
            if (!res.ok) {
                return setError({ status: true, message: "An error occured" })
            }

            const data = await res.json() as IUser[]
            if (data.length === 0) return setError({ status: true, message: "Email/password is invalid" })

            setCookie("userData", data[0])
            data[0].isAdmin ? router.push("/admin") : router.push("/")
        } catch (e) {
            return setError({ status: true, message: "An error occured" })
        }
    }

    return (
        <main className='h-screen w-screen flex justify-center items-center'>
            <div className='bg-red-500 w-96 p-5 rounded-xl'>
                <form action="#" className='flex flex-col gap-y-5' onSubmit={(e) => loginHandler(e)}>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="email">Email</label>
                        <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className='p-2 rounded-lg border-2' placeholder='john.doe@mail.com' required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="password">Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" className='p-2 rounded-lg border-2' placeholder='************' required />
                    </div>
                    <button type='submit' className='bg-green-500 w-full py-2 rounded-full'>Log In</button>
                    {error?.status && <p className='text-center text-sm'>{error.message}</p>}
                </form>
                <p className='text-center mt-10 text-sm'>Not registered yet? <Link href="/register" className='font-bold'>Register Here</Link></p>
            </div>
        </main>

    )
}

export default Login