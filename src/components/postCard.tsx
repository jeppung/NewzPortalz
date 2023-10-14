import Image from 'next/image'
import React from 'react'
import { ITrendingCardProps } from './trendingCard'
import { useRouter } from 'next/router'
import moment from 'moment'

interface IPostCardProps extends ITrendingCardProps{
    createdAt: string
}

const PostCard = ({createdAt,description,slug,thumbnail,title}: Omit<IPostCardProps, "premium">) => {

    const router = useRouter()

  return (
    <div className="flex bg-[#1F4172] rounded-md overflow-hidden shadow-lg">
        <Image src={thumbnail} width={150} height={150} className='h-[150px]' alt="terserah"/>
        <div className="text-white p-4 flex flex-col  flex-1">
            <h1 className="font-bold hover:cursor-pointer" onClick={() => router.push(`/posts/${slug}`)}>{title}</h1>
            <p className="text-xs mt-2 flex-1">{description}</p>
            <p className="mt-6 self-end text-xs">
                {moment(createdAt).format("DD MMMM YYYY HH:mm")}
            </p>
        </div>
    </div>
  )
}

export default PostCard