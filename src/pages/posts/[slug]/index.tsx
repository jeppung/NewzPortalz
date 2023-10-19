import Navbar from '@/components/navbar'
import { IPost } from '@/pages/admin/posts'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import parse from 'html-react-parser';
import moment from 'moment';
import { AiFillHeart, AiOutlineHeart, AiOutlineShareAlt } from "react-icons/ai"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getCookie, setCookie } from 'cookies-next';
import { IReadHistory, IUser, PostCategory} from '@/pages/login';
import PostCard from '@/components/postCard';
import { NextRequest } from 'next/server';
import { GetServerSidePropsContext } from 'next';



const PostDetail = ({ }) => {
    const [post, setPost] = useState<IPost | null>(null)
    const [recommendedPosts, setRecommendedPosts] = useState<IPost[] | null>(null)
    const [isLike, setIsLike] = useState<boolean | null>(false)
    const [likesCounter, setLikesCounter] = useState<number>(0)
    const [sharesCounter, setSharesCounter] = useState<number>(0)
    const router = useRouter()

    const getPostDetail = async () => {
        const user = getUserData()

        if (user != undefined) {
            let dataIndex = user?.readHistory?.findIndex(data => data.slug === router.query.slug)
            if (dataIndex !== -1 && dataIndex !== undefined) {
                setIsLike(user!.readHistory![dataIndex!].isLike)
            }
        }


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
            return console.log("Error fetching post detail data")
        }
    }

    const likeHandler = () => {
        const user = getUserData()
        if (user === undefined) return router.push("/login")

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
        const user = getUserData()
        if (user === undefined) return router.push("/login")

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


    const likesStatisticHandler = (user: IUser) => {
        switch(post?.category) {
            case "entertainment": {
                return {...user?.statistic.likes, entertainment: !isLike ? user!.statistic.likes.entertainment + 1 : user!.statistic.likes.entertainment - 1}
            }
            case "others": {
                return {...user?.statistic.likes, others: !isLike ? user!.statistic.likes.others + 1 : user!.statistic.likes.others - 1}
            }
            case "politics": {
                 return {...user?.statistic.likes, politics: !isLike ? user!.statistic.likes.politics + 1 : user!.statistic.likes.politics - 1}
            }
            case "sports": {
                return {...user?.statistic.likes, sports: !isLike ? user!.statistic.likes.sports + 1 : user!.statistic.likes.sports - 1}
            }
            case "technology": {
                return {...user?.statistic.likes, technology: !isLike ? user!.statistic.likes.technology + 1 : user!.statistic.likes.technology -  1}
            }
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
                    statistic: {
                        likes: likesStatisticHandler(user!)
                    },
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
            return console.log("Error adding post to history")
        }
    }

    const addToHistory = async () => {
        const user = getUserData()
        if (user === undefined) return
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

    const recommendedPostsHandler = () => {
        const user = getUserData()

        if(user !== undefined) {
            let arr = Object.values(user.statistic.likes)
            let max = Math.max(...arr) 

            const topCategory = Object.keys(user.statistic.likes).sort().find(key => {
                return user.statistic.likes[key as PostCategory] === max
            })

            getRecommendedPost(topCategory!)
        }
    }

    const getRecommendedPost = async (category: string) => {
        try{
            const res = await fetch(`http://localhost:6969/posts?category=${category}`)
            if(!res.ok){
                return alert(`Error fetch recommended posts data ${res.statusText}`)
            }
            const data = await res.json() as IPost[]
            const tempArr: IPost[] = []
            console.log(data)
            if(data.length > 3){
                // let tempData = data[Math.floor(Math.random() * tempArr.length)]
                // let isTempDataExist = tempArr.findIndex((data) => data.id === tempData.id)
                // if(isTempDataExist !== -1){
                //     tempArr.push(tempData)
                // }
            }else{
                console.log("no")
                // return setRecommendedPosts(data)
            }

        }catch(e){
            return console.log(`Error fetch recommended posts data - ${e}`)
        }
    }


    useEffect(() => {
        if (router.query.slug !== undefined) {
            getPostDetail()
            addToHistory()
            recommendedPostsHandler()
        }
    }, [router])



    return (
        <>
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
                <section className='mt-10 content-wrapper'>
                    {post && parse(post.body)}
                </section>
                <section className='mt-20'>
                    <h1 className='text-3xl'>Recommended for you</h1>
                    <div className='mt-5 flex flex-col gap-y-2'>
                        {
                            recommendedPosts?.map((post) => {
                                return <PostCard data={post}/>
                            })
                        }
                    </div>
                </section>
            </main>
        </>
    )
}

export default PostDetail

export async function getServerSideProps(context: GetServerSidePropsContext) {

    const user = JSON.parse(context.req.cookies["userData"]!) as IUser

    const recommendedPostsHandler = () => {
        let arr = Object.values(user.statistic.likes)
        let max = Math.max(...arr) 

        const topCategory = Object.keys(user.statistic.likes).sort().find(key => {
            return user.statistic.likes[key as PostCategory] === max
        })

        getRecommendedPost(topCategory!)
    }

    const getRecommendedPost = async (category: string) => {
        try{
            const res = await fetch(`http://localhost:6969/posts?category=${category}`)
            if(!res.ok){
                return alert(`Error fetch recommended posts data ${res.statusText}`)
            }
            const data = await res.json() as IPost[]
            const tempArr: IPost[] = []
            console.log(data)
            if(data.length > 3){
                while(tempArr.length < 3){
                    let tempData = data[Math.floor(Math.random() * tempArr.length)]
                    tempArr.push(tempData)
                }
                console.log(tempArr)
            }else{
                console.log("no")
            }

            console.log("made it here")
        }catch(e){
            return console.log(`Error fetch recommended posts data - ${e}`)
        }
    }

    recommendedPostsHandler()
 
  // Pass data to the page via props
  return { props: { "dsa": "dsa"} }
}