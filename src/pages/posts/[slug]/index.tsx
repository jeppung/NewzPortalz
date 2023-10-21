import Navbar from '@/components/navbar'
import { IPost } from '@/pages/admin/posts'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import parse from 'html-react-parser';
import moment from 'moment';
import { AiFillHeart, AiOutlineHeart, AiOutlineShareAlt } from "react-icons/ai"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { setCookie } from 'cookies-next';
import { IReadHistory, IUser, PostCategory } from '@/pages/login';
import PostCard from '@/components/postCard';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import{FaCrown} from "react-icons/fa"
import Link from 'next/link';


const PostDetail = ({ recommendedPosts, userData }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [post, setPost] = useState<IPost | null>(null)
    const [isLike, setIsLike] = useState<boolean | null>(false)
    const [likesCounter, setLikesCounter] = useState<number>(0)
    const [sharesCounter, setSharesCounter] = useState<number>(0)
    const [isProtected, setIsProtected] = useState<boolean>(false)

    const router = useRouter()

    const getPostDetail = async () => {
        if (userData !== null) {
            let dataIndex = userData.readHistory?.findIndex(data => data.slug === router.query.slug)
            if (dataIndex !== -1 && dataIndex !== undefined) {
                setIsLike(userData.readHistory![dataIndex!].isLike)
            }
        }

        try {
            const res = await fetch(`http://localhost:6969/posts?slug=${router.query.slug}&_expand=user`)
            if (!res.ok) {
                return alert("Error fetching post detail data")
            }
            const data = await res.json() as IPost[]
            
            if(data[0].isPremium && userData?.subscription.type !== "premium") {
                setIsProtected(true)
                data[0].body = data[0].body.slice(0, data[0].body.length / 2)
            }else{
                setIsProtected(false)
            }

       

            setPost(data[0])
            setLikesCounter(data[0].likes)
            setSharesCounter(data[0].shares)
        } catch (e) {
            return console.log("Error fetching post detail data")
        }
    }

    const likeHandler = () => {
        if (userData === null) return router.push("/login")

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
        if (userData === null) return router.push("/login")

        setSharesCounter(sharesCounter + 1)
        updateShare()
    }

    const updateShare = async () => {
        const dataIndex = userData?.readHistory?.findIndex(data => data.slug === post?.slug)
        if (dataIndex !== -1 && userData!.readHistory![dataIndex!].isShare === false) {
            userData!.readHistory![dataIndex!].isShare = true
            try {
                const res = await fetch(`http://localhost:6969/users/${userData!.id}`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        readHistory: userData!.readHistory
                    } as IUser),
                    headers: {
                        "Content-type": "application/json"
                    }
                })

                if (!res.ok) return alert("Error updating share")

                const newUserData = await res.json()
                setCookie("userData", newUserData, {
                    maxAge: 60 * 60
                })
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


    const likesStatisticHandler = () => {
        switch (post?.category) {
            case "entertainment": {
                return { ...userData?.statistic.likes, entertainment: !isLike ? userData!.statistic.likes.entertainment + 1 : userData!.statistic.likes.entertainment - 1 }
            }
            case "others": {
                return { ...userData?.statistic.likes, others: !isLike ? userData!.statistic.likes.others + 1 : userData!.statistic.likes.others - 1 }
            }
            case "politics": {
                return { ...userData?.statistic.likes, politics: !isLike ? userData!.statistic.likes.politics + 1 : userData!.statistic.likes.politics - 1 }
            }
            case "sports": {
                return { ...userData?.statistic.likes, sports: !isLike ? userData!.statistic.likes.sports + 1 : userData!.statistic.likes.sports - 1 }
            }
            case "technology": {
                return { ...userData?.statistic.likes, technology: !isLike ? userData!.statistic.likes.technology + 1 : userData!.statistic.likes.technology - 1 }
            }
        }
    }

    const updateLike = async (count: number) => {
        const dataIndex = userData?.readHistory?.findIndex(data => data.slug === post?.slug)
        if (dataIndex === -1) return

        userData!.readHistory![dataIndex!].isLike = !isLike

        try {
            const res = await fetch(`http://localhost:6969/users/${userData!.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    statistic: {
                        likes: likesStatisticHandler( )
                    },
                    readHistory: userData!.readHistory
                } as IUser),
                headers: {
                    "Content-type": "application/json"
                }
            })

            if (!res.ok) return alert("Error updating like")

            const newUserData = await res.json()
            setCookie("userData", newUserData, {
                maxAge: 60 * 60
            })
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
            setCookie("userData", newUserData, {
                maxAge: 60 * 60
            })
        } catch (e) {
            return console.log("Error adding post to history")
        }
    }

    const addToHistory = async () => {
        if (userData === null) return
        const date = new Date().toISOString()

        let data: IReadHistory = {
            id: 1,
            slug: router.query.slug as string,
            isLike: false,
            isShare: false,
            createdAt: "",
            updatedAt: ""
        }

        if (userData!.readHistory == null) {
            data.createdAt = date
            data.updatedAt = date
            updateUserHistory([data], userData!)
        } else {
            const isExistIndex = userData!.readHistory.findIndex((data) => data.slug === router.query.slug)
            if (isExistIndex === -1) {
                data.id = userData!.readHistory.length + 1
                data.createdAt = date
                data.updatedAt = date
                updateUserHistory([...userData!.readHistory, data], userData!)
            } else {
                userData!.readHistory[isExistIndex].updatedAt = date
                updateUserHistory([...userData!.readHistory], userData!)
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
            <Head>
                <title>{post?.title}</title>
            </Head>
            <Navbar />
            <main className='max-w-7xl mx-auto py-10 px-5 md:px-0'>
                <section className='border-b-2 pb-2 flex flex-col md:flex-row justify-between items-end'>
                    <div className='w-full'>
                        <h1 className='text-3xl  font-bold'>{post?.title}</h1>
                        <h2 className='text-sm text-gray-500'>{post?.description}</h2>
                    </div>
                    <div className='flex flex-col w-full mt-5 gap-x-2'>
                        <div className='md:self-end'>
                            <p>Author: {post?.user.name}</p>
                        </div>
                        <div className='flex md:self-end gap-x-2'>
                            <p>{moment(post?.createdAt).format("MMMM DD YYYY HH:mm")}</p>

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
                    </div>
                </section>
                <section className='flex justify-center mt-5'>
                    <img src={post?.thumbnail} className='object-cover' width={400} />
                </section>
                <section className={`mt-10 content-wrapper relative ${isProtected && "h-[50vh]"} overflow-hidden` }>
                    <div className={`${isProtected && "absolute"}`}>
                        {post && parse(post.body)}
                    </div>
                    {
                        isProtected && <div className='absolute bg-gradient-to-t from-white from-60%  w-full h-full flex justify-center items-end pb-10'>
                        <div className='flex flex-col justify-center items-center'>
                                <FaCrown size={100} color="orange"/>
                                <h1>Premium content</h1>
                                <Link href={userData !== null ? "/subscription" : "/login"} className='py-2 px-3 bg-[#112D4E] rounded-md text-sm text-white '>Subscribe to premium</Link>
                            </div>
                        </div>
                    }
                </section>
                {
                    recommendedPosts && <section className='mt-20'>
                        <h1 className='text-3xl'>Recommended for you</h1>
                        <div className='mt-5 flex flex-col gap-y-2'>
                            {
                                recommendedPosts?.map((post) => {
                                    return <PostCard data={post} />
                                })
                            }
                        </div>
                    </section>
                }
            </main>
        </>
    )
}

export default PostDetail

export async function getServerSideProps(context: GetServerSidePropsContext) {
    let recommendedPosts: IPost[] | null = []
    let user: IUser | null

    try {
        user = JSON.parse(context.req.cookies["userData"]!) as IUser
        
        const recommendedPostsHandler = async () => {
            let arr = Object.values(user!.statistic.likes)
            let max = Math.max(...arr)

            const topCategory = Object.keys(user!.statistic.likes).sort().find(key => {
                return user!.statistic.likes[key as PostCategory] === max
            })

            await getRecommendedPost(topCategory!)
        }

        const getUserData = async () => {
            try {
                const res = await fetch(`http://localhost:6969/auth/user/${user?.id}`)
                if (!res.ok) {
                    return alert(`Error fetching user data ${res.statusText}`)
                }
                const data = await res.json() as IUser
                user = data
                setCookie("userData", data, {
                    maxAge: 60 * 60
                })
            } catch (e) {
                return alert(`Error fetching user data ${e}`)
            }
        }

        const getRecommendedPost = async (category: string) => {
            try {
                const res = await fetch(`http://localhost:6969/posts?category=${category}&slug_ne=${context.params?.slug}`)
                if (!res.ok) {
                    return alert(`Error fetch recommended posts data ${res.statusText}`)
                }
                const data = await res.json() as IPost[]
                let tempArr: IPost[] = []
                if (data.length > 3) {
                    tempArr = data.slice(0, 3)
                } else {
                    tempArr = data
                }

                recommendedPosts = tempArr

            } catch (e) {
                console.log(`Error fetch recommended posts data - ${e}`)
                recommendedPosts = []
            }
        }
        
        await getUserData()
        await recommendedPostsHandler()
    } catch (e) {
        user = null
        recommendedPosts = null
    }

    return {
        props: {
            recommendedPosts: recommendedPosts,
            userData: user
        }
    }
}