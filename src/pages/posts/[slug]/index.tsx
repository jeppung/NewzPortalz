import Navbar from '@/components/navbar'
import { IPost } from '@/pages/admin/posts'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import parse from 'html-react-parser';
import moment from 'moment';
import {AiFillHeart, AiOutlineHeart, AiOutlineShareAlt} from "react-icons/ai"
import {CopyToClipboard} from 'react-copy-to-clipboard';


const PostDetail = ({ }) => {
    const [post, setPost] = useState<IPost | null>(null)
    const [isLike, setIsLike] = useState<boolean>(false)
    const [likesCounter, setLikesCounter] = useState<number>(0)
    const [sharesCounter, setSharesCounter] = useState<number>(0)
    const router = useRouter()

    const getPostDetail = async () => {
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

    const likeHandler = async () => {
        if(isLike) {
            setLikesCounter(likesCounter - 1)
        }else{
            setLikesCounter(likesCounter + 1)
        }
        setIsLike(!isLike)
    }



    useEffect(() => {
        if(router.query.slug !== undefined){
            getPostDetail()
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
                            <button onClick={likeHandler}>{isLike ? <AiFillHeart color="red"/> : <AiOutlineHeart/>}</button>
                        </div>
                        <CopyToClipboard text={`http://localhost:3000/posts/${router.query.slug}`} onCopy={() => alert("Link copied")}>
                           <div className='flex gap-x-1'>
                                <p>{sharesCounter}</p>
                                <button onClick={() => setSharesCounter(sharesCounter+1)}><AiOutlineShareAlt/></button>
                           </div>
                        </CopyToClipboard>
                    </div>
                </section>
            </main>
        </>
    )
}

export default PostDetail