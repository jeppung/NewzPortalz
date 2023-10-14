
import Image from 'next/image'
import Link from 'next/link'
import { title } from 'process'
import React from 'react'

interface ITrendingCardProps {
    premium: boolean
    thumbnail: string
    title: string
    description: string
    slug: string
}

const TrendingCard = ({premium, thumbnail, title, slug}: ITrendingCardProps) => {
  return (
    <div className="bg-[#FDF0F0] shadow-xl  w-[350px] rounded-2xl relative">
        { premium && <Image src="/premium_tag.svg" className="absolute right-[-30px] top-[-30px]" width={100} height={100} alt="terserah"/>}
        <Image src={thumbnail} className="rounded-tl-2xl rounded-tr-2xl w-full h-[200px] object-cover" width={300} height={100} alt="terserah"/>
        <div className="p-4 flex flex-col">
            <h2 className="text-xl w-full font-bold">{title}</h2>
            <p className="text-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.  ltrices mauris. Maecenas vitae mattis tellus.</p>
            <Link href={`/posts/${slug}`} className="mt-2 bg-[#132043] text-white text-xs rounded-md py-[5px] px-[15px] self-end">See more</Link>
        </div>
    </div>
  )
}

export default TrendingCard