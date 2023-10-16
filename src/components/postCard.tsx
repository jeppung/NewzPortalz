import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import { IPost } from '@/pages/admin/posts'

interface IPostCardProps {
    data: IPost
}

const PostCard = ({ data }: IPostCardProps) => {

    const router = useRouter()

    return (
        <div className="flex bg-[#1F4172] rounded-md overflow-hidden shadow-lg">
            <Image src={data.thumbnail} width={150} height={150} className='h-[150px]' alt="terserah" />
            <div className="text-white p-4 flex flex-col  flex-1">
                <h1 className="font-bold hover:cursor-pointer" onClick={() => router.push(`/posts/${data.slug}`)}>{data.title}</h1>
                <p className="text-xs mt-2 flex-1">{data.description}</p>
                <div className='flex justify-between '>
                    <div className='flex text-xs gap-x-2'>
                        <p>{data.likes} Likes</p>
                        <p>{data.shares} Shares</p>
                    </div>
                    <div className="text-xs">
                        <p>
                            {moment(data.createdAt).format("DD MMMM YYYY HH:mm")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostCard