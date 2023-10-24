import Navbar from '@/components/navbar'
import PostModal from '@/components/postModal'
import { BASE_DB_URL } from '@/constants/url'
import { IUser } from '@/pages/login'
import axios, { isAxiosError } from 'axios'
import moment from 'moment'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai"
export type PostCategory = "technology" | "entertainment" | "politics" | "sports" | "others"
export interface IPost {
    id?: number
    userId: number
    title: string
    slug: string
    description: string
    thumbnail: string
    body: string
    likes: number
    shares: number
    category: PostCategory
    isPremium: boolean
    user: IUser
    createdAt: string
    updatedAt: string
}

interface IModalPost {
    isModal: boolean
    type: "create" | "edit"
    initialData?: IPost
}

export interface IPaginationLink {
    link: string
    status: string
}

export interface IPagination {
    _page: number
    _limit: number
    data: IPaginationLink[]
}

interface IPostsFilter {
    search: string
    date: {
        startDate: Date | undefined
        endDate: Date
    }
}

const AdminPosts = () => {

    const [posts, setPosts] = useState<IPost[]>([])
    const [modal, setModal] = useState<IModalPost>({ isModal: false, type: "create" })
    const [pagination, setPagination] = useState<IPagination | null>(null)
    const [filter, setFilter] = useState<IPostsFilter>({
        search: "",
        date: {
            startDate: undefined,
            endDate: new Date(new Date().setHours(23, 59, 59))
        }
    })
    const startDateRef = useRef<HTMLInputElement>(null)
    const endDateRef = useRef<HTMLInputElement>(null)

    const startDateFocusHandler = () => {
        startDateRef.current?.showPicker()
    }

    const endDateFocusHandler = () => {
        endDateRef.current?.showPicker()
    }

    const getPostsData = async (url: string) => {
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

                const params = new URL(url).searchParams
                console.log(new URL(url).searchParams.get("_limit"))

                setPagination({
                    _page: parseInt(params.get("_page")!),
                    _limit: parseInt(params.get("_limit")!),
                    data: link
                })
            } else {
                setPagination(null)
            }

            const data = res.data as IPost[]
            setPosts(data)
        } catch (e) {
            if (isAxiosError(e)) {
                return alert(`Error fetching posts data ${e.cause}`)
            }
        }
    }

    const deleteHandler = async (post: IPost) => {
        let isConfirm = confirm("Are you sure to delete this post?")

        if (isConfirm) {
            try {
                const res = await fetch(`${BASE_DB_URL}/posts/${post.id}`, {
                    method: "DELETE",
                })
                if (!res.ok) {
                    return alert("An error has occured")
                }
                setPosts([...posts.filter((data) => data.id !== post.id)])
                return
            } catch (e) {
                return alert("An error has occured")
            }
        }
    }


    useEffect(() => {
        getPostsData(`${BASE_DB_URL}/posts?q=${filter.search}&_expand=user&_page=1&_limit=10&createdAt_gte=${filter.date.startDate ? filter.date.startDate.toISOString() : ""}&createdAt_lte=${filter.date.endDate.toISOString()}`)
    }, [filter])

    return (
        <>
            <Head>
                <title>Newz Portalz | Posts</title>
            </Head>
            {
                modal.isModal && <PostModal type={modal.type} onClose={() => setModal({ ...modal, isModal: false })} onSuccess={() => {
                    setModal({ ...modal, isModal: false })
                    getPostsData(`${BASE_DB_URL}/posts?_expand=user&_page=${pagination?._page}&_limit=${pagination?._limit}`)
                }} initialData={modal.initialData} />
            }
            <Navbar />
            <main className='max-w-7xl mx-auto pt-10'>
                <div className='flex justify-between'>
                    <h1 className='text-3xl'>Posts</h1>
                    <div className='flex gap-x-2'>
                        <input type="text" name="search_post" id="search_post" placeholder='Search...' className='w-96 border rounded-md px-2' onChange={(e) => {
                            setFilter({ ...filter, search: e.target.value })
                        }} />
                        <div className=' flex items-center'>
                            <div className='relative w-32 rounded-md bg-slate-200 flex items-center' onClick={startDateFocusHandler}>
                                <label htmlFor="dateStart" className='absolute px-2 w-full text-end' >{filter.date.startDate ? moment(filter.date.startDate).format("MM/DD/YYYY") : "Start date"}</label>
                                <input type="date" name="dateStart" id="dateStart" ref={startDateRef} className='absolute invisible' onChange={(e) => {
                                    if (e.target.valueAsDate === null) return setFilter({ ...filter, date: { ...filter.date, startDate: undefined } })
                                    setFilter({ ...filter, date: { ...filter.date, startDate: e.target.valueAsDate } })
                                }} />
                            </div>
                            <p>-</p>
                            <div className='relative w-32 rounded-md bg-slate-200 flex items-center' onClick={endDateFocusHandler}>
                                <label htmlFor="dateEnd" className='absolute px-2  w-full text-start' >{moment(filter.date.endDate).format("MM/DD/YYYY")}</label>
                                <input type="date" name="dateEnd" id="dateEnd" ref={endDateRef} className='absolute invisible' onChange={(e) => {
                                    if (e.target.valueAsDate === null) return setFilter({ ...filter, date: { ...filter.date, endDate: new Date(new Date().setHours(23, 59, 59)) } })
                                    setFilter({ ...filter, date: { ...filter.date, endDate: new Date(e.target.valueAsDate!.setHours(23, 59, 59)) } })
                                }} />
                            </div>
                        </div>
                        <button onClick={() => setModal({ isModal: true, type: "create" })} className='bg-yellow-500 py-1 px-2 rounded-lg text-white text-sm'>Create Post</button>
                    </div>
                </div>
                <section className='mt-5 '>
                    <table className='w-full table border border-collapse'>
                        <thead className='bg-green-500 text-white'>
                            <tr>
                                <th className='p-2 text-start'>No</th>
                                <th className='p-2 text-start'>Title</th>
                                <th className='p-2 text-start'>Slug</th>
                                <th className='p-2 text-start'>Author</th>
                                <th className='p-2 text-start'>Category</th>
                                <th className='p-2 text-start'>Created At</th>
                                <th className='p-2 text-start'>Updated At</th>
                                <th className='p-2 text-start'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                posts.map((post, i) => {
                                    return (
                                        <tr key={i} className='border'>
                                            <td className='p-2'>{pagination ? (pagination!._page * pagination!._limit) - 10 + 1 + i : i + 1}</td>
                                            <td className='p-2'>{post.title}</td>
                                            <td className='p-2'>{post.slug}</td>
                                            <td className='p-2'>{post.user.name}</td>
                                            <td className='p-2'>{post.category}</td>
                                            <td className='p-2'>{moment(post.createdAt).format("MM-DD-YYYY HH:mm:ss")}</td>
                                            <td className='p-2'>{moment(post.updatedAt).format("MM-DD-YYYY HH:mm:ss")}</td>

                                            <td>
                                                <div className='flex justify-around'>
                                                    <Link href={`/posts/${post.slug}`}><AiFillEye size={20} /></Link>
                                                    <button onClick={() => setModal({ isModal: true, type: 'edit', initialData: post })} ><AiFillEdit size={20} /></button>
                                                    <button onClick={() => deleteHandler(post)}><AiFillDelete color="red" size={20} /></button>
                                                </div>
                                            </td>
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
                                    return getPostsData(url!.trim())
                                }} className='py-1 border-2 rounded-md px-2'>Prev</button>
                            }
                            {
                                pagination?.data.find((data) => data.status === "next") && <button onClick={() => {
                                    const url = pagination?.data.find((data) => data.status === "next")?.link
                                    return getPostsData(url!.trim())
                                }} className='py-1 border-2 rounded-md px-2'>Next</button>
                            }
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default AdminPosts