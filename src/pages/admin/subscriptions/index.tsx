import Navbar from '@/components/navbar'
import { IUser } from '@/pages/login'
import moment from 'moment'
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

    const deactiveHandler = async (user: IUser) => {
        let isConfirm = confirm(`Are you sure to deactivate subscription for ${user.name} ?`)
        if (isConfirm) {
            try {
                const res = await fetch(`http://localhost:6969/users/${user.id}`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        subscription: "free"
                    }),
                    headers: {
                        "Content-type": "application/json"
                    }
                })
                if (!res.ok) {
                    return alert("An error has occured")
                }
                let relatedUser = users.find((data) => data.id === user.id)
                relatedUser!.subscription.type = "free"
                relatedUser!.subscription.expiredAt = null

                setUsers([...users])
                return
            } catch (e) {
                return alert("An error has occured")
            }
        }
        return
    }

    useEffect(() => {
        getUserData()
    }, [])

    return (
        <>
            <Navbar />
            <main className='max-w-7xl mx-auto pt-10'>
                <h1 className='text-3xl'>Subscriptions</h1>

                <section className='mt-5 '>
                    <table className='w-full table border border-collapse'>
                        <thead className='bg-green-500 text-white'>
                            <tr>
                                <th className='p-2 text-start'>No</th>
                                <th className='p-2 text-start'>Name</th>
                                <th className='p-2 text-start'>Subscription</th>
                                <th className='p-2 text-start'>Expired At</th>
                                <th className='p-2 text-start'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map((user, i) => {
                                    return (
                                        <tr key={i} className='border'>
                                            <td className='p-2'>{i + 1}</td>
                                            <td className='p-2'>{user.name}</td>
                                            <td className='p-2'>{user.subscription.type}</td>
                                            <td className='p-2'>{user.subscription.expiredAt !== null ? moment(user.subscription.expiredAt).format("MM-DD-YYYY HH:mm:ss") : "unlimited"}</td>
                                            {
                                                user.subscription.type === "premium" && <td><button onClick={() => deactiveHandler(user)} className='bg-red-500 py-1 px-2 rounded-lg text-white text-sm'>Deactive</button></td>
                                            }
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