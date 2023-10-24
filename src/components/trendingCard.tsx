import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export interface ITrendingCardProps {
  premium: boolean
  thumbnail: string
  title: string
  description: string
  slug: string
}

const TrendingCard = ({ premium, thumbnail, title, slug, description }: ITrendingCardProps) => {
  return (
    <div className="bg-[#FDF0F0] shadow-xl md:max-w-[350px] rounded-2xl relative flex flex-col">
      {premium && <Image src="/premium_tag.svg" className={`hidden md:flex absolute right-[-30px] top-[-30px]`} width={100} height={100} alt="premium_logo" />}
      {premium && <p className='right-0 w-fit md:hidden bg-[#E9EB97] absolute text-sm p-2 rounded-tr-xl rounded-bl-xl text-black font-bold'>Premium</p>}
      <Image src={thumbnail} className="rounded-tl-2xl rounded-tr-2xl w-full h-[200px] object-cover" width={300} height={100} alt="terserah" />
      <div className="p-4 flex flex-col flex-1 ">
        <p className="text-xl  truncate font-bold text-ellipsis overflow-hidden">{title} </p>
        <p className="mt-1 text-xs flex-1 line-clamp-3">{description}</p>
        <Link href={`/posts/${slug}`} className="mt-2 bg-[#132043] text-white text-xs rounded-md py-[5px] px-[15px] self-end">See more</Link>
      </div>
    </div>
  )
}

export default TrendingCard