import Navbar from "@/components/navbar";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { IUser } from "./login";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TrendingCard from "@/components/trendingCard";
import { IPost, PostCategory } from "./admin/posts";
import PostCard from "@/components/postCard";
import moment from "moment";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';

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
  const [isDateModal, setIsDateModal] = useState<boolean>(false)
  const userData = getCookie("userData")
  const router = useRouter()

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

  const getPostsData = async () => {
    try {
      const res = await fetch(`http://localhost:6969/posts?_expand=user&title_like=${filter.search}&category_like=${filter.category}&isPremium_like=${filter.type}&_sort=${filter.sort}&_order=${filter.order}&createdAt_gte=${filter.date.startDate ? filter.date.startDate.toISOString() : ""}&createdAt_lte=${filter.date.endDate.toISOString()}`)
      if (!res.ok) {
        alert("Error get post data")
      }
      const data = await res.json()
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
    getPostsData()
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
          <div className="max-w-7xl mx-auto flex justify-around">
            <Image src="/hero.png" width={380} height={380} alt="Hero" />
            <div className="text-white text-5xl font-bold flex flex-col justify-around">
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
        <section className="bg-[#112D4E] pt-[50px] pb-[80px]" id="posts">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white">All Posts</h1>
            <div className="mt-10 flex justify-between">
              <div className="flex gap-x-2">
                <input type="text" className="p-2 rounded-md text-sm w-[318px]" name="search" id="search" placeholder="Search by title..." onChange={(e) => setFilter({ ...filter, search: e.target.value })} />
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
              <div className="flex gap-x-2">
                {/* <input className="p-2 rounded-md" type="date" name="date" id="date" onChange={(e) => {
                  if (e.target.valueAsDate === null) return setFilter({ ...filter, date: "" })
                  return setFilter({ ...filter, date: moment(e.target.valueAsDate).format("YYYY-MM-DD").toString() })
                }} /> */}
                <div className="bg-white h-10 w-52 rounded-md relative" onClick={() => setIsDateModal(true)}>
                  {
                    isDateModal && <dialog open>
                      <DateRange
                        calendarFocus="forwards"
                        ranges={[{ startDate: filter.date.startDate, endDate: filter.date.endDate, key: "selection" }]}
                        onRangeFocusChange={(e) => {
                          if (e[0] === 0 && e[1] === 0) {
                            setIsDateModal(false)
                          }
                        }}
                        onChange={(e) => {
                          setFilter({ ...filter, date: { startDate: e.selection.startDate!, endDate: new Date(e.selection.endDate!.setHours(23, 59, 59)) } })
                        }} />
                    </dialog>
                  }
                </div>
                <select name="order" id="order" className="p-2 rounded-md text-sm" value={filter.order} onChange={(e) => setFilter({ ...filter, order: e.target.value as PostFilterOrder })}>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            <div id="posts-wrapper" className="mt-10 grid grid-cols-2 gap-x-20 gap-y-5">
              {
                filteredPosts.map((post, i) => {
                  return (
                    <PostCard key={i} data={post} />
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
