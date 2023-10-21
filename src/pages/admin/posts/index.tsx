import Navbar from '@/components/navbar'
import PostModal from '@/components/postModal'
import { IUser } from '@/pages/login'
import axios, { Axios, isAxiosError } from 'axios'
import moment from 'moment'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {AiFillDelete, AiFillEdit, AiFillEye} from "react-icons/ai"
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

const AdminPosts = () => {

    const [posts, setPosts] = useState<IPost[]>([])
    const [modal, setModal] = useState<IModalPost>({ isModal: false, type: "create" })
    const [pagination, setPagination] = useState<IPagination | null>(null)

    const getPostsData = async (url: string) => {
        try {
            const res = await axios.get(url)

            if (res.headers.link !== "") {
                const link = res.headers.link.split(",").map((data: string) => {
                    let data2 = data.split(";")
                    return {
                        link: data2[0].replace("<", "").replace(">", ""),
                        status: data2[1].match(/last|next|first|prev/g)?.[0]
                    }
                })

                const params = new URLSearchParams(url)

                setPagination({
                    _page: parseInt(params.get("_page")!),
                    _limit: parseInt(params.get("_limit")!),
                    data: link
                })
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
                const res = await fetch(`http://localhost:6969/posts/${post.id}`, {
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
        getPostsData("http://localhost:6969/posts?_expand=user&_page=1&_limit=10")
    }, [])

    return (
        <>
            <Head>
                <title>Newz Portalz | Posts</title>
            </Head>
            {
                modal.isModal && <PostModal type={modal.type} onClose={() => setModal({ ...modal, isModal: false })} onSuccess={() => {
                    setModal({ ...modal, isModal: false })
                    getPostsData(`http://localhost:6969/posts?_expand=user&_page=${pagination?._page}&_limit=${pagination?._limit}`)
                }} initialData={modal.initialData} />
            }
            <Navbar />
            <main className='max-w-7xl mx-auto pt-10'>
                <div className='flex justify-between'>
                    <h1 className='text-3xl'>Posts</h1>
                    <button onClick={() => setModal({ isModal: true, type: "create" })} className='bg-yellow-500 py-1 px-2 rounded-lg text-white text-sm'>Create Post</button>
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
                                                    <Link href={`/posts/${post.slug}`}><AiFillEye size={20}/></Link>
                                                    <button onClick={() => setModal({ isModal: true, type: 'edit', initialData: post })} ><AiFillEdit size={20}/></button>
                                                    <button onClick={() => deleteHandler(post)}><AiFillDelete color="red" size={20}/></button>
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