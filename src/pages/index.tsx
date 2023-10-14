import Navbar from "@/components/navbar";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { IUser } from "./login";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TrendingCard from "@/components/trendingCard";
import { IPost } from "./admin/posts";
import PostCard from "@/components/postCard";


export default function Home() {
  const [user, setUser] = useState<IUser | undefined>()
  const [posts, setPosts] = useState<IPost[]>([])
  const userData = getCookie("userData")
  const router = useRouter()

  const getCurrWeek = (date: number) => {
    const currDate = date
    const startOfTheDate = new Date(new Date().getFullYear(), 0, 1).getTime()
    const msInDay = 24 * 3600 * 1000
    const days = Math.floor((currDate-startOfTheDate) / (msInDay))
    const currWeek = Math.ceil(days / 7)

    return currWeek
  }

  const getTrendingPostWeek = ()  => {
    let currWeek = getCurrWeek(new Date().getTime())

    let postOfTheWeek = posts.filter((post) => {
      const postDate = new Date(post.createdAt).getTime()
      if(getCurrWeek(postDate) === currWeek){
        return post
      }
    })

    postOfTheWeek.sort((post1,post2) => post2.likes - post1.likes)
    return postOfTheWeek.slice(0,5).map((post, i) => {
      return <TrendingCard key={i} title={post.title} description={post.description} slug={post.slug} thumbnail={post.thumbnail} premium={post.isPremium}/>
    })
  }

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

  useEffect(() => {
    if(userData !== undefined) {
      setUser(JSON.parse(userData!) as IUser)
    }
    getPostsData()
  }, [])
  
  return (
    <>
      <Navbar onRefresh={() => router.reload()} />
      <main>
        <section className="bg-[#112D4E] w-full pt-[50px] pb-[80px]">
         <div className="max-w-7xl mx-auto flex justify-around">
           <Image src="/hero.png" width={380} height={380} alt="Hero"/>
          <div className="text-white text-5xl font-bold flex flex-col justify-around">
            <div >
              <h1>Good Morning,</h1>
              <h1>{user?.name.split(" ")[0]}</h1>
            </div>
            <div>
              <h1>Let's read some news!</h1>
            </div>
          </div>
         </div>
        </section>
        <section className="bg-[#F9F7F7] pt-[50px] pb-[80px]">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold">Trending post of this week 🔥</h1>
            <div id="card-wrapper" className="mt-[60px] flex gap-x-20 flex-wrap justify-center gap-y-12">
              {
                getTrendingPostWeek()
              }
            </div>
          </div>
        </section>
        <section className="bg-[#112D4E] pt-[50px] pb-[80px]">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white">All Posts</h1>
            <div className="mt-10 flex justify-between">
              <div className="flex gap-x-2">
                <input type="text" className="p-2 rounded-md text-sm w-[318px]" name="search" id="search" placeholder="Search..." />
                <select name="category" id="category" className="p-2 rounded-md text-sm">
                  <option value="1">Technology</option>
                  <option value="1">Entertainment</option>
                  <option value="1">Politics</option>
                  <option value="1">Sports</option>
                </select>
                <select name="type" id="type" className="p-2 rounded-md text-sm">
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div className="flex gap-x-2">
                <input type="date" name="date" id="date" className="p-2 rounded-md text-sm"/>
                
                <select name="sort" id="sort" className="p-2 rounded-md text-sm">
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            <div id="posts-wrapper" className="mt-10 grid grid-cols-2 gap-x-20 gap-y-5">
              {
                posts.map((post, i) => {
                  return(
                    <PostCard key={i} title={post.title} slug={post.slug} description={post.description} thumbnail={post.thumbnail} createdAt={post.createdAt}/>
                  )
                })
              }
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
