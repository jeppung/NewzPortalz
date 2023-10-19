import Navbar from '@/components/navbar'
import { getCookie, setCookie } from 'cookies-next'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { IUser } from '../login'
import { IPost } from '../admin/posts'
import moment from 'moment'
import { ISubsTransaction, encrypt } from '../subscription'
import SubsModal from '@/components/subsModal'

const Profile = () => {
    const [user, setUser] = useState<IUser>()
    const [posts, setPosts] = useState<IPost[]>()
    const [transactions, setTransactions] = useState<ISubsTransaction[]>()
    const [isModal, setIsModal] = useState<boolean>(false)
    const [paymentLink, setPaymentLink] = useState<string>("")

    const getPostsData = async () => {
        try {
            const res = await fetch("http://localhost:6969/posts")
            if (!res.ok) {
                return alert(`Error fetching posts data ${res.statusText}`)
            }
            const data = await res.json() as IPost[]
            setPosts(data)
        } catch (e) {
            return alert(`Error fetching posts data ${e}`)
        }
    }

    const getTransactionsData = async () => {
        try {
            const res = await fetch("http://localhost:6969/transactions?_sort=createdAt&_order=desc")
            if (!res.ok) {
                return alert(`Error fetching posts data ${res.statusText}`)
            }
            const data = await res.json() as ISubsTransaction[]
            setTransactions(data)
        } catch (e) {
            return alert(`Error fetching posts data ${e}`)
        }
    }

    const paymentHandler = (transaction: ISubsTransaction) => {
        setPaymentLink(btoa(encrypt(transaction)))

        setIsModal(true)
    }

    const getUserData = async () => {
        const cookie = getCookie("userData")
        if (cookie !== undefined) {
            const cookieUser = JSON.parse(cookie) as IUser
            try {
                const res = await fetch(`http://localhost:6969/auth/user/${cookieUser.id}`)
                if (!res.ok) {
                    return alert(`Error fetching user data ${res.statusText}`)
                }
                const data = await res.json() as IUser
                setUser(data)
                setCookie("userData", data)
            } catch (e) {
                return alert(`Error fetching user data ${e}`)
            }
        }
    }

    useEffect(() => {
        getUserData()
        getPostsData()
        getTransactionsData()
    }, [])

    return (
        <div className='flex flex-col h-screen'>
            {
                isModal && <SubsModal onClose={() => {
                    setIsModal(false)
                    setPaymentLink("")
                }} link={`/transaction/${paymentLink}`} />
            }
            <Navbar />
            <main className='bg-[#112D4E] flex-1 py-[50px] px-5 md:px-0'>
                <div className='max-w-7xl mx-auto h-full '>
                    <section className='flex flex-col md:flex-row  justify-between  h-full'>
                        <div className='text-white '>
                            <h1 className='text-[40px]'>Profile</h1>
                            <div className='mt-5 flex flex-col gap-y-5'>
                                <div>
                                    <h3 className='font-bold '>Name</h3>
                                    <p>{user?.name}</p>
                                </div>
                                <div>
                                    <h3 className='font-bold'>Email</h3>
                                    <p>{user?.email}</p>
                                </div>
                                <div>
                                    <h3 className='font-bold'>Phone</h3>
                                    <p>{user?.phone}</p>
                                </div>
                                <div>
                                    <h3 className='font-bold'>Address</h3>
                                    <p>{user?.address}</p>
                                </div>
                                <div>
                                    <h3 className='font-bold'>Subscription</h3>
                                    <p>{user?.subscription.type} (Expired {moment(user?.subscription.expiredAt).format("DD MMMM YYYY")})</p>
                                </div>
                            </div>
                        </div>
                        <div className='text-white w-full mt-14 md:mt-0 md:w-[50%]  flex flex-col'>
                            <div className='flex flex-col flex-1 '>
                                <h1 className='text-[40px]'>Read history</h1>
                                <div className='mt-5 flex flex-col gap-y-2 overflow-auto h-80'>
                                    {
                                        user?.readHistory !== null ? <table>
                                            <thead>
                                                <tr>
                                                    <th className='text-start'>Title</th>
                                                    <th className='text-start'>Last access</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {user?.readHistory && user.readHistory.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((data, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>
                                                                <Link href={`/posts/${data.slug}`}>{
                                                                    posts?.find(post => post.slug === data.slug)?.title
                                                                }</Link>
                                                            </td>
                                                            <td>{moment(data.updatedAt).format("DD MMMM YYYY HH:mm")}</td>
                                                        </tr>
                                                    )
                                                })}

                                            </tbody>
                                        </table> : <p>There are no read history yet</p>
                                    }
                                </div>
                            </div>
                            <div className='flex flex-col mt-10 md:mt-0 flex-1 h-full'>
                                <h1 className='text-[40px]'>Pending Transaction</h1>
                                <div className='mt-5 flex flex-col gap-y-2 h-80 overflow-y-auto'>
                                    {
                                        transactions?.filter((data) => data.userId === user?.id).findIndex((data) => data.status === "waiting payment") !== -1 ?
                                            <>
                                                <div className='md:hidden'>
                                                    {transactions?.map((data, i) => {
                                                        if (data.userId === user?.id && data.status === "waiting payment") {
                                                            return (
                                                                <div className='flex justify-between items-center'>
                                                                    <div>
                                                                        <h1 className='font-bold'>Subscription</h1>
                                                                        <p className='text-sm'>{data.status}</p>
                                                                        <p className='text-sm'>Created at: {moment(data.createdAt).format("DD MMMM YYYY HH:mm")}</p>
                                                                    </div>
                                                                    <div>
                                                                        <button onClick={() => paymentHandler(data)} className='bg-[#1F4172] px-4 py-1 text-sm rounded-md'>Pay</button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                                <table className='hidden md:inline-table'>
                                                    <thead>
                                                        <tr>
                                                            <th className='text-start'>Item</th>
                                                            <th className='text-start'>Type</th>
                                                            <th className='text-start'>Duration</th>
                                                            <th className='text-start'>Created At</th>
                                                            <th className='text-start'>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {transactions?.map((data, i) => {
                                                            if (data.userId === user?.id && data.status === "waiting payment") {
                                                                return (
                                                                    <tr key={i}>
                                                                        <td>Subscription</td>
                                                                        <td>{data.type}</td>
                                                                        <td>{data.duration}</td>
                                                                        <td>{moment(data.createdAt).format("DD MMMM YYYY HH:mm")}</td>
                                                                        <td><button onClick={() => paymentHandler(data)} className='bg-[#1F4172] px-4 py-1 text-sm rounded-md'>Pay</button></td>
                                                                    </tr>
                                                                )
                                                            }
                                                        })}
                                                    </tbody>
                                                </table>
                                            </> : <p>There are no pending transcations</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main >
        </div >
    )
}

export default Profile