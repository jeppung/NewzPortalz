import Navbar from '@/components/navbar'
import PostModal from '@/components/postModal'
import { IUser } from '@/pages/login'
import React, { useEffect, useState } from 'react'

interface IPost {
    id?: number
    userId: number
    title: string
    slug: string
    description: string
    body: string
    likes: number
    shares: number
    isPremium: boolean
    user: IUser
}

const AdminPosts = () => {

    const [posts, setPosts] = useState<IPost[]>([])
    const [isModal, setIsModal] = useState<boolean>(false)
    
    const getPostsData = async () => {
        try {
            const res = await fetch("http://localhost:6969/posts?_expand=user")
            if (!res.ok) {
                console.log(res.statusText)
            }
            const data = await res.json()
            setPosts(data)
        } catch (e) {
            console.log(e)
        }
    }

    const deleteHandler = async (post: IPost) => {
        let isConfirm = confirm("Are you sure to delete this post?")

        if(isConfirm) {
            try{
                const res = await fetch(`http://localhost:6969/posts/${post.id}`, {
                    method: "DELETE",
                })
                if(!res.ok){
                    return alert("An error has occured")
                }
                setPosts([...posts.filter((data) => data.id !== post.id)])
                return
            }catch(e){
                return alert("An error has occured")
            }
        }
    }

    useEffect(() => {
        getPostsData()
    }, [])

    return (
        <>
            {
                isModal && <PostModal onClose={() => setIsModal(false)}/>
            }
            <Navbar />
            <main className='max-w-7xl mx-auto pt-10'>
                <div className='flex justify-between'>
                    <h1 className='text-3xl'>Posts</h1>
                    <button onClick={() => setIsModal(true)} className='bg-yellow-500 py-1 px-2 rounded-lg text-white text-sm'>Create Post</button>
                </div>
                <section className='mt-5 '>
                    <table className='w-full table border border-collapse'>
                        <thead className='bg-green-500 text-white'>
                            <tr>
                                <th className='p-2 text-start'>No</th>
                                <th className='p-2 text-start'>Title</th>
                                <th className='p-2 text-start'>Slug</th>
                                <th className='p-2 text-start'>Author</th>
                                <th className='p-2 text-start'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                posts.map((post, i) => {
                                    return(
                                        <tr key={i} className='border'>
                                            <td className='p-2'>{i+1}</td>
                                            <td className='p-2'>{post.title}</td>
                                            <td className='p-2'>{post.slug}</td>
                                            <td className='p-2'>{post.user.name}</td>
                                            <td>
                                                <div className='flex justify-around'>
                                                    <button>see</button>
                                                    <button>edit</button>
                                                    <button onClick={() => deleteHandler(post)}>del</button>
                                                </div>
                                            </td>
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

export default AdminPosts