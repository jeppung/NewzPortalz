import Navbar from "@/components/navbar";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { IUser } from "./login";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import TrendingCard from "@/components/trendingCard";
import { IPagination, IPost, PostCategory } from "./admin/posts";
import PostCard from "@/components/postCard";
import moment from "moment";
import axios from "axios";

type PostFilterOrder = "desc" | "asc"

interface IPostsFilter {
  search: string
  type: string
  sort: "createdAt"
  order: PostFilterOrder
  category: PostCategory | string,
  date: {
    startDate: Date | undefined,
    endDate: Date
  }
}

export default function Home() {
  const initialFilter: IPostsFilter = {
    search: "",
    sort: "createdAt",
    order: "desc",
    type: "",
    category: "",
    date: {
      startDate: undefined,
      endDate: new Date()
    }
  }

  const [user, setUser] = useState<IUser | undefined>()
  const [posts, setPosts] = useState<IPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<IPost[]>([])
  const [filter, setFilter] = useState<IPostsFilter>(initialFilter)
  const [initialLoad, setInitialLoad] = useState<boolean>(true)
  const [pagination, setPagination] = useState<IPagination | null>(null)
  const startDateRef = useRef<HTMLInputElement>(null)
  const endDateRef = useRef<HTMLInputElement>(null)
  const userData = getCookie("userData")
  const router = useRouter()

  const startDateFocusHandler = () => {
    startDateRef.current?.showPicker()
  }

  const endDateFocusHandler = () => {
    endDateRef.current?.showPicker()
  }


  const getLastSevenDaysDate = () => {
    const date = new Date()

    let arr = []
    let counter = date.getTime()

    for (let i = 0; i < 7; i++) {
      const date = new Date(counter - (24 * 60 * 60 * 1000)).toISOString()
      arr.push(date.substring(0, 10))
      counter -= (24 * 60 * 60 * 1000)
    }

    return arr
  }

  const getTrendingPostWeek = () => {
    let lastWeekDates = getLastSevenDaysDate()

    let postOfTheWeek = posts.filter((post) => {
      let validation = lastWeekDates.findIndex((date => date == post.createdAt.substring(0, 10)))
      if (validation) return post
    })

    postOfTheWeek.sort((post1, post2) => post2.likes - post1.likes)

    return postOfTheWeek.slice(0, 5).map((post, i) => {
      return (
        <TrendingCard key={i} title={post.title} description={post.description} slug={post.slug} thumbnail={post.thumbnail} premium={post.isPremium} />
      )
    })

  }

  const getPostsData = async (url: string) => {
    try {
      const res = await axios.get(url)

      if (res.headers.link !== "") {
        const link = res.headers.link.split(",").map((data: string) => {
          let data2 = data.split(";")
          return {
            link: data2[0].replace("<", "").replace(">", ""),
            status: data2[1].match(/last|next|first|prev/g)?.[0]
          }
        })

        const params = new URLSearchParams(url)

        setPagination({
          _limit: parseInt(params.get("_limit")!),
          _page: parseInt(params.get("_page")!),
          data: link
        })
      } else {
        setPagination(null)
      }

      const data = res.data as IPost[]
      if (initialLoad) {
        setPosts(data)
      }
      setFilteredPosts(data)
    } catch (e) {
      alert("Error get post data")
    }
  }

  const getGreeting = () => {
    const currHour = moment().hour()
    if (currHour >= 0 && currHour < 12) {
      return "Good Morning,"
    } else if (currHour >= 12 && currHour < 18) {
      return "Good Afternoon,"
    } else {
      return "Good Evening,"
    }
  }

  useEffect(() => {
    getPostsData(`http://localhost:6969/posts?_expand=user&title_like=${filter.search}&category_like=${filter.category}&isPremium_like=${filter.type}&_sort=${filter.sort}&_order=${filter.order}&createdAt_gte=${filter.date.startDate ? filter.date.startDate.toISOString() : ""}&createdAt_lte=${filter.date.endDate.toISOString()}&_page=${pagination ? pagination._page : 1}&_limit=${pagination ? pagination._limit : 10}`)
    setInitialLoad(false)
  }, [filter])

  useEffect(() => {
    if (userData !== undefined) {
      setUser(JSON.parse(userData!) as IUser)
    }
  }, [])

  return (
    <>
      <Navbar onRefresh={() => router.reload()} />
      <main>
        <section className="bg-[#112D4E] w-full pt-[50px] pb-[80px]">
          <div className="max-w-7xl mx-auto flex px-5 md:px-0 md:justify-around">
            <Image className="hidden md:flex" src="/hero.png" width={380} height={380} alt="Hero" />
            <div className="text-white text-3xl md:text-5xl font-bold flex flex-col justify-around">
              <div >
                <h1>{getGreeting()}</h1>
                <h1>{user?.name.split(" ")[0]}</h1>
              </div>
              <div>
                <h1>Let's read some news!</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-[#F9F7F7] pt-[50px] pb-[80px] px-5 md:px-0">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold">Trending post of this week 🔥</h1>
            <div id="card-wrapper" className="mt-[60px]  flex flex-col md:flex-row  md:flex-wrap justify-center gap-y-12 gap-x-20">
              {
                getTrendingPostWeek()
              }
            </div>
          </div>
        </section>
        <section className="bg-[#112D4E] pt-[50px] pb-[80px]" id="posts">
          <div className="max-w-7xl mx-auto px-5 md:px-0">
            <h1 className="text-3xl font-bold text-white">All Posts</h1>
            <div className="mt-10 flex flex-col gap-y-10 md:gap-y-0 md:flex-row justify-between">
              <div className="flex gap-x-2 flex-col gap-y-2 md:flex-row">
                <input type="text" className="p-2 rounded-md text-sm w-full md:max-w-[318px]" name="search" id="search" placeholder="Search by title..." onChange={(e) => setFilter({ ...filter, search: e.target.value })} />
                <select name="category" id="category" className="p-2 rounded-md text-sm" value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })}>
                  <option value="">All</option>
                  <option value="technology">Technology</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="politics">Politics</option>
                  <option value="sports">Sports</option>
                </select>
                <select name="type" id="type" className="p-2 rounded-md text-sm" value={`${filter.type}`} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
                  <option value="">All</option>
                  <option value="false">Free</option>
                  <option value="true">Premium</option>
                </select>
              </div>
              <div className="flex gap-y-2 md:gap-y-0 md:gap-x-2 flex-col md:flex-row ">
                <div className="flex justify-center md:justify-normal">
                  <div className='relative w-32 rounded-md text-white flex items-center' onClick={startDateFocusHandler}>
                    <label htmlFor="dateStart" className='absolute px-2 w-full text-end' >{filter.date.startDate ? moment(filter.date.startDate).format("MM/DD/YYYY") : "Start date"}</label>
                    <input type="date" name="dateStart" id="dateStart" ref={startDateRef} className='absolute invisible' onChange={(e) => {
                      if (e.target.valueAsDate === null) return setFilter({ ...filter, date: { ...filter.date, startDate: undefined } })
                      setFilter({ ...filter, date: { ...filter.date, startDate: e.target.valueAsDate } })
                    }} />
                  </div>
                  <p className="self-center text-white">-</p>
                  <div className='relative w-32 rounded-md text-white flex items-center' onClick={endDateFocusHandler}>
                    <label htmlFor="dateEnd" className='absolute px-2  w-full text-start' >{moment(filter.date.endDate).format("MM/DD/YYYY")}</label>
                    <input type="date" name="dateEnd" id="dateEnd" ref={endDateRef} className='absolute invisible' onChange={(e) => {
                      if (e.target.valueAsDate === null) return setFilter({ ...filter, date: { ...filter.date, endDate: new Date(new Date().setHours(23, 59, 59)) } })
                      setFilter({ ...filter, date: { ...filter.date, endDate: new Date(e.target.valueAsDate!.setHours(23, 59, 59)) } })
                    }} />
                  </div>
                </div>
                <select name="order" id="order" className="p-2 rounded-md text-sm" value={filter.order} onChange={(e) => setFilter({ ...filter, order: e.target.value as PostFilterOrder })}>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            <div id="posts-wrapper" className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-5">
              {
                filteredPosts.map((post, i) => {
                  return (
                    <PostCard key={i} data={post} />
                  )
                })
              }
            </div>
            <div className='mt-5 flex justify-end'>
              <div className='flex gap-x-2'>
                {
                  pagination?.data.find((data) => data.status === "prev") && <button onClick={() => {
                    const url = pagination?.data.find((data) => data.status === "prev")?.link
                    return getPostsData(url!.trim())
                  }} className='py-1 bg-white border-2 rounded-md px-2'>Prev</button>
                }
                {
                  pagination?.data.find((data) => data.status === "next") && <button onClick={() => {
                    const url = pagination?.data.find((data) => data.status === "next")?.link
                    return getPostsData(url!.trim())
                  }} className='py-1 bg-white border-2 rounded-md px-2'>Next</button>
                }
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
