import Navbar from '@/components/navbar'
import { IUser } from '@/pages/login'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { IPagination } from '../posts'
import axios from 'axios'
import Head from 'next/head'
import { BASE_DB_URL } from '@/constants/url'

const AdminSubscription = () => {

    const [users, setUsers] = useState<IUser[]>([])
    const [pagination, setPagination] = useState<IPagination>()

    const getUserData = async (url: string) => {
        try {
            const res = await axios.get(url)

            if (res.headers.link !== "") {
                const link = res.headers.link.split(",").map((data: string) => {
                    let data2 = data.split(";")
                    return {
                        link: data2[0].replace("<", "").replace(">", "").replace("http", "https"),
                        status: data2[1].match(/last|next|first|prev/g)?.[0]
                    }
                })

                const params = new URLSearchParams(url)

                setPagination({
                    _limit: parseInt(params.get("_limit")!),
                    _page: parseInt(params.get("_page")!),
                    data: link
                })
            }

            const data = res.data as IUser[]
            setUsers(data)
        } catch (e) {
            console.log(e)
        }
    }

    const deactiveHandler = async (user: IUser) => {
        let isConfirm = confirm(`Are you sure to deactivate subscription for ${user.name} ?`)
        if (isConfirm) {
            try {
                const res = await fetch(`${BASE_DB_URL}/users/${user.id}`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        subscription: {
                            type: "free",
                            expiredAt: null
                        }
                    } as IUser),
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
        getUserData(`${BASE_DB_URL}/users?_page=${pagination ? pagination._page : 1}&_limit=${pagination ? pagination._limit : 10}`)
    }, [])

    return (
        <>
            <Head>
                <title>Newz Portalz | Subscription</title>
            </Head>
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
                                            <td className='p-2'>{pagination ? (pagination!._page * pagination!._limit) - 10 + 1 + i : i + 1}</td>
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
                    <div className='mt-2 flex justify-end'>
                        <div className='flex gap-x-2'>
                            {
                                pagination?.data.find((data) => data.status === "prev") && <button onClick={() => {
                                    const url = pagination?.data.find((data) => data.status === "prev")?.link
                                    return getUserData(url!.trim())
                                }} className='py-1 border-2 rounded-md px-2'>Prev</button>
                            }
                            {
                                pagination?.data.find((data) => data.status === "next") && <button onClick={() => {
                                    const url = pagination?.data.find((data) => data.status === "next")?.link
                                    return getUserData(url!.trim())
                                }} className='py-1 border-2 rounded-md px-2'>Next</button>
                            }
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default AdminSubscription