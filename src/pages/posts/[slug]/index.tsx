import Navbar from '@/components/navbar'
import { IPost } from '@/pages/admin/posts'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import parse from 'html-react-parser';
import { HTMLReactParserOptions, Element } from 'html-react-parser';
import { attributesToProps } from 'html-react-parser';

const PostDetail = ({ }) => {
    const [post, setPost] = useState<IPost>()
    const router = useRouter()

    const getPostDetail = async () => {
        try {
            const res = await fetch(`http://localhost:6969/posts?slug=${router.query.slug}&_expand=user`)
            if (!res.ok) {
                return alert("Error fetching post detail data")
            }
            const data = await res.json() as IPost[]
            setPost(data[0])
        } catch (e) {
            return alert("Error fetching post detail data")
        }
    }



    const options: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof Element && domNode.attribs) {
                if (domNode.name === "h1") {
                    console.log(domNode.attributes)
                }
            }
        }
    };

    useEffect(() => {
        getPostDetail()
    }, [])

    return (
        <>
            <Navbar />
            <main className='max-w-7xl mx-auto py-10'>
                <section className='border-b-2 pb-2 flex justify-between items-end'>
                    <div>
                        <h1 className='text-3xl'>{post?.title}</h1>
                        <h2 className='text-xl text-gray-500'>{post?.description}</h2>
                    </div>
                    <div>
                        <p>Author: {post?.user.name}</p>
                    </div>
                </section>
                <section className='flex justify-center mt-5'>
                    <img src={post?.thumbnail} />
                </section>
                <section className='mt-10 content-wrapper'>
                    {post && parse(post.body, options)}
                </section>
            </main>
        </>
    )
}

export default PostDetail