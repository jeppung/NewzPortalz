import Navbar from '@/components/navbar'
import { IPost } from '@/pages/admin/posts'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import parse from 'html-react-parser';
import moment from 'moment';
import { AiFillHeart, AiOutlineHeart, AiOutlineShareAlt } from "react-icons/ai"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getCookie, setCookie } from 'cookies-next';
import { IReadHistory, IUser } from '@/pages/login';


const PostDetail = ({ }) => {
    const [post, setPost] = useState<IPost | null>(null)
    const [isLike, setIsLike] = useState<boolean>(false)
    const [likesCounter, setLikesCounter] = useState<number>(0)
    const [sharesCounter, setSharesCounter] = useState<number>(0)
    const router = useRouter()

    const getPostDetail = async () => {
        const user = getUserData()

        let dataIndex = user?.readHistory?.findIndex(data => data.slug === router.query.slug)
        setIsLike(user!.readHistory![dataIndex!].isLike)

        try {
            const res = await fetch(`http://localhost:6969/posts?slug=${router.query.slug}&_expand=user`)
            if (!res.ok) {
                return alert("Error fetching post detail data")
            }
            const data = await res.json() as IPost[]
            setPost(data[0])
            setLikesCounter(data[0].likes)
            setSharesCounter(data[0].shares)
        } catch (e) {
            return alert(`Error fetching post detail data ${e}`)
        }
    }

    const likeHandler = () => {
        if (isLike) {
            setLikesCounter(likesCounter - 1)
            updateLike(likesCounter - 1)
        } else {
            setLikesCounter(likesCounter + 1)
            updateLike(likesCounter + 1)
        }
        setIsLike(!isLike)
    }

    const shareHandler = () => {
        setSharesCounter(sharesCounter + 1)
        updateShare()
    }

    const getUserData = () => {
        const cookie = getCookie("userData")
        if (cookie !== undefined) {
            return JSON.parse(cookie) as IUser
        }
    }

    const updateShare = async () => {
        const user = getUserData()
        const dataIndex = user?.readHistory?.findIndex(data => data.slug === post?.slug)
        if (dataIndex !== -1 && user!.readHistory![dataIndex!].isShare === false) {
            user!.readHistory![dataIndex!].isShare = true
            try {
                const res = await fetch(`http://localhost:6969/users/${user!.id}`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        readHistory: user!.readHistory
                    } as IUser),
                    headers: {
                        "Content-type": "application/json"
                    }
                })

                if (!res.ok) return alert("Error updating share")

                const newUserData = await res.json()
                setCookie("userData", newUserData)
            } catch (e) {
                return alert(`Error updating share ${e}`)
            }
        }

        try {
            const res = await fetch(`http://localhost:6969/posts/${post?.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    shares: post!.shares + 1,
                    updatedAt: new Date().toISOString()
                } as IPost),
                headers: {
                    "Content-type": "application/json"
                }
            })

            if (!res.ok) return alert("Error updating share")
        } catch (e) {
            return alert(`Error updating share ${e}`)
        }

    }

    const updateLike = async (count: number) => {
        const user = getUserData()
        const dataIndex = user?.readHistory?.findIndex(data => data.slug === post?.slug)

        if (dataIndex === -1) return

        user!.readHistory![dataIndex!].isLike = !isLike

        try {
            const res = await fetch(`http://localhost:6969/users/${user!.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    readHistory: user!.readHistory
                } as IUser),
                headers: {
                    "Content-type": "application/json"
                }
            })

            if (!res.ok) return alert("Error updating like")

            const newUserData = await res.json()
            setCookie("userData", newUserData)
        } catch (e) {
            return alert(`Error updating like ${e}`)
        }

        try {
            const res = await fetch(`http://localhost:6969/posts/${post?.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    likes: count,
                    updatedAt: new Date().toISOString()
                } as IPost),
                headers: {
                    "Content-type": "application/json"
                }
            })

            if (!res.ok) return alert("Error updating like")
        } catch (e) {
            return alert(`Error updating like ${e}`)
        }
    }

    const updateUserHistory = async (data: IReadHistory[], user: IUser) => {
        try {
            const res = await fetch(`http://localhost:6969/users/${user.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    readHistory: data
                } as IUser),
                headers: {
                    "Content-type": "application/json"
                }
            })
            if (!res.ok) return alert("Error adding post to history")
            const newUserData = await res.json()
            setCookie("userData", newUserData)
        } catch (e) {
            return alert("Error adding post to history")
        }
    }

    const addToHistory = async () => {
        const user = getUserData()
        const date = new Date().toISOString()

        let data: IReadHistory = {
            id: 1,
            slug: router.query.slug as string,
            isLike: false,
            isShare: false,
            createdAt: "",
            updatedAt: ""
        }

        if (user!.readHistory == null) {
            data.createdAt = date
            data.updatedAt = date
            updateUserHistory([data], user!)
        } else {
            const isExistIndex = user!.readHistory.findIndex((data) => data.slug === router.query.slug)
            if (isExistIndex === -1) {
                data.id = user!.readHistory.length + 1
                data.createdAt = date
                data.updatedAt = date
                updateUserHistory([...user!.readHistory, data], user!)
            } else {
                user!.readHistory[isExistIndex].updatedAt = date
                updateUserHistory([...user!.readHistory], user!)
            }
        }
    }


    useEffect(() => {
        if (router.query.slug !== undefined) {
            getPostDetail()
            addToHistory()
        }
    }, [router])

    return (
        <>
            <Navbar />
            <main className='max-w-7xl mx-auto py-10'>
                <section className='border-b-2 pb-2 flex justify-between items-end'>
                    <div className='max-w-4xl'>
                        <h1 className='text-3xl font-bold'>{post?.title}</h1>
                        <h2 className='text-sm text-gray-500'>{post?.description}</h2>
                    </div>
                    <div>
                        <p>Author: {post?.user.name}</p>
                    </div>
                </section>
                <section className='flex justify-center mt-5'>
                    <img src={post?.thumbnail} className='object-cover' width={400} />
                </section>
                <section className='mt-10 content-wrapper'>
                    {post && parse(post.body)}
                </section>
                <section className='flex gap-x-5 justify-between mt-16'>
                    <div>
                        <p>Created at: {moment(post?.createdAt).format("MMMM DD YYYY HH:mm")}</p>
                    </div>
                    <div className='flex gap-x-5'>
                        <div className='flex gap-x-1'>
                            <p>{likesCounter}</p>
                            <button onClick={likeHandler}>{isLike ? <AiFillHeart color="red" /> : <AiOutlineHeart />}</button>
                        </div>
                        <CopyToClipboard text={`http://localhost:3000/posts/${router.query.slug}`} onCopy={() => alert("Link copied")}>
                            <div className='flex gap-x-1'>
                                <p>{sharesCounter}</p>
                                <button onClick={shareHandler}><AiOutlineShareAlt /></button>
                            </div>
                        </CopyToClipboard>
                    </div>
                </section>
            </main>
        </>
    )
}

export default PostDetail