import Link from 'next/link'
import React, { useState } from 'react'
import { IUser } from '../login'



const Register = () => {
    const [user, setUser] = useState<Partial<IUser>>({})

    const registerHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    const checkPassword = (passwordC: string) => {
        if (passwordC !== user.password) {
            console.log("Not Matched", passwordC, user.password)
        }
    }

    return (
        <main className='h-screen w-screen flex justify-center items-center'>
            <div className='bg-red-500 w-96 p-5 rounded-xl'>
                <form action="#" className='flex flex-col gap-y-5' onSubmit={(e) => registerHandler(e)}>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="name">Name</label>
                        <input onChange={(e) => setUser({ ...user, name: e.target.value })} type="text" name="name" id="name" className='p-2 rounded-lg border-2' placeholder='John Doe' required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="phone">Phone</label>
                        <input onChange={(e) => setUser({ ...user, phone: parseInt(e.target.value) })} type="number" name="phone" id="phone" className='p-2 rounded-lg border-2' placeholder='081245237751' required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="address">Address</label>
                        <input onChange={(e) => setUser({ ...user, address: e.target.value })} type="text" name="address" id="address" className='p-2 rounded-lg border-2' placeholder='JL. Somewhere only you know' required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="email">Email</label>
                        <input onChange={(e) => setUser({ ...user, email: e.target.value })} type="email" name="email" id="email" className='p-2 rounded-lg border-2' placeholder='john.doe@mail.com' required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="password">Password</label>
                        <input onChange={(e) => setUser({ ...user, password: e.target.value })} type="password" name="password" id="password" className='p-2 rounded-lg border-2' placeholder='************' required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="passwordC">Password Confirmation</label>
                        <input onChange={(e) => checkPassword(e.target.value)} type="password" name="passwordC" id="passwordC" className='p-2 rounded-lg border-2' placeholder='************' required />
                    </div>
                    <button type='submit' className='bg-green-500 w-full py-2 rounded-full'>Register</button>

                </form>
                <p className='text-center mt-10 text-sm'>Not registered yet? <Link href="/login" className='font-bold'>Login Here</Link></p>
            </div>
        </main>
    )
}

export default Register