import Navbar from '@/components/navbar'
import { IUser } from '@/pages/login'
import React, { useEffect, useState } from 'react'

const AdminSubscription = () => {

    const [users, setUsers] = useState<IUser[]>([])

    const getUserData = async () => {
        try {
            const res = await fetch("http://localhost:6969/users")
            if (!res.ok) {
                console.log(res.statusText)
            }
            const data = await res.json()
            setUsers(data)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getUserData()
    }, [])


    return (
        <>
            <Navbar />
            <main className='max-w-7xl mx-auto pt-10'>
                <h1 className='text-3xl'>Subscription</h1>

                <section className='mt-5 '>
                    <table className='w-full table border border-collapse'>
                        <thead className='bg-green-500 text-white'>
                            <td className='p-2'><th>Name</th></td>
                            <td className='p-2'><th>Subscription</th></td>
                            <td className='p-2'><th>Actions</th></td>
                        </thead>
                        <tbody>
                            {
                                users.map(user => {
                                    return (
                                        <tr>
                                            <td className='p-2'>{user.name}</td>
                                            <td className='p-2'>{user.subscription}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </section>
            </main>
        </>
    )
}

export default AdminSubscription