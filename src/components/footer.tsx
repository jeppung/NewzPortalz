import Link from 'next/link'
import React from 'react'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { BsFacebook } from 'react-icons/bs'

const Footer = () => {
  return (
    <footer className="bg-[#112D4E] p-4">
        <div className=" max-w-7xl mx-auto flex justify-between">
          <div className="text-white text-xs">
            <h1>Copyright &#169; 2023 NewzPotalz | Designed by Kevin</h1>
          </div>
          <div className="text-white flex gap-x-2">
              <Link href={"/#instagram"}><AiOutlineInstagram size={20}/></Link>
              <Link href={"/#twitter"}><AiOutlineTwitter size={20}/></Link>
              <Link href={"/#facebook"}><BsFacebook size={18}/></Link>            
          </div>
        </div>
      </footer>
  )
}

export default Footer