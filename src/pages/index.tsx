import Navbar from "@/components/navbar";
import Image from "next/image";


export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#112D4E] w-full pt-[50px] pb-[80px]">
         <div className="max-w-7xl mx-auto flex justify-around">
           <Image src="/hero.png" width={380} height={380} alt="Hero"/>
          <div className="text-white text-5xl font-bold flex flex-col justify-around">
            <div >
              <h1>Good Morning,</h1>
              <h1>Joshua</h1>
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
              <div className="bg-[#FDF0F0] shadow-xl  w-[350px] rounded-2xl relative">
                <Image src="/premium_tag.svg" className="absolute right-[-30px] top-[-30px]" width={100} height={100} alt="terserah"/>
                <Image src="https://picsum.photos/600/400" className="rounded-tl-2xl rounded-tr-2xl" width={600} height={500} alt="terserah"/>
                <div className="p-4 flex flex-col">
                  <h2 className="text-xl font-bold">Lorem ipsum dolor amet</h2>
                  <p className="text-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.  ltrices mauris. Maecenas vitae mattis tellus.</p>
                  <button className="mt-2 bg-[#132043] text-white text-xs rounded-md py-[5px] px-[15px] self-end">See more</button>
                </div>
              </div>
              <div className="bg-[#FDF0F0] shadow-xl  w-[350px] rounded-2xl overflow-hidden">
                <Image src="https://picsum.photos/600/400" width={600} height={500} alt="terserah"/>
                <div className="p-4 flex flex-col">
                  <h2 className="text-xl font-bold">Lorem ipsum dolor amet</h2>
                  <p className="text-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.  ltrices mauris. Maecenas vitae mattis tellus.</p>
                  <button className="mt-2 bg-[#132043] text-white text-xs rounded-md py-[5px] px-[15px] self-end">See more</button>
                </div>
              </div>
              <div className="bg-[#FDF0F0] shadow-xl  w-[350px] rounded-2xl relative">
                <Image src="/premium_tag.svg" className="absolute right-[-30px] top-[-30px]" width={100} height={100} alt="terserah"/>
                <Image src="https://picsum.photos/600/400" className="rounded-tl-2xl rounded-tr-2xl" width={600} height={500} alt="terserah"/>
                <div className="p-4 flex flex-col">
                  <h2 className="text-xl font-bold">Lorem ipsum dolor amet</h2>
                  <p className="text-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.  ltrices mauris. Maecenas vitae mattis tellus.</p>
                  <button className="mt-2 bg-[#132043] text-white text-xs rounded-md py-[5px] px-[15px] self-end">See more</button>
                </div>
              </div>
              <div className="bg-[#FDF0F0] shadow-xl  w-[350px] rounded-2xl overflow-hidden">
                <Image src="https://picsum.photos/600/400" width={600} height={500} alt="terserah"/>
                <div className="p-4 flex flex-col">
                  <h2 className="text-xl font-bold">Lorem ipsum dolor amet</h2>
                  <p className="text-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.  ltrices mauris. Maecenas vitae mattis tellus.</p>
                  <button className="mt-2 bg-[#132043] text-white text-xs rounded-md py-[5px] px-[15px] self-end">See more</button>
                </div>
              </div>
              <div className="bg-[#FDF0F0] shadow-xl  w-[350px] rounded-2xl overflow-hidden">
                <Image src="https://picsum.photos/600/400" width={600} height={500} alt="terserah"/>
                <div className="p-4 flex flex-col">
                  <h2 className="text-xl font-bold">Lorem ipsum dolor amet</h2>
                  <p className="text-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.  ltrices mauris. Maecenas vitae mattis tellus.</p>
                  <button className="mt-2 bg-[#132043] text-white text-xs rounded-md py-[5px] px-[15px] self-end">See more</button>
                </div>
              </div>
              
            </div>
          </div>
        </section>
        <section className="bg-[#112D4E] pt-[50px] pb-[80px]">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white">All Posts</h1>
            <div id="posts-wrapper" className="mt-10 grid grid-cols-2 gap-x-20 gap-y-5">
              <div className="flex bg-[#1F4172] rounded-md overflow-hidden shadow-lg">
                <Image src="https://picsum.photos/600/400" width={150} height={150} alt="terserah"/>
                <div className="text-white p-4">
                  <h1 className="font-bold">Lorem Ipsum Dolor Amet</h1>
                  <p className="text-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.  ltrices mauris. Maecenas vitae mattis tellus.</p>
                </div>
              </div>
              <div className="flex bg-[#1F4172] rounded-md overflow-hidden shadow-lg">
                <Image src="https://picsum.photos/600/400" width={150} height={150} alt="terserah"/>
                <div className="text-white p-4">
                  <h1 className="font-bold">Lorem Ipsum Dolor Amet</h1>
                  <p className="text-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.  ltrices mauris. Maecenas vitae mattis tellus.</p>
                </div>
              </div>
              <div className="flex bg-[#1F4172] rounded-md overflow-hidden shadow-lg">
                <Image src="https://picsum.photos/600/400" width={150} height={150} alt="terserah"/>
                <div className="text-white p-4">
                  <h1 className="font-bold">Lorem Ipsum Dolor Amet</h1>
                  <p className="text-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.  ltrices mauris. Maecenas vitae mattis tellus.</p>
                </div>
              </div>
              <div className="flex bg-[#1F4172] rounded-md overflow-hidden shadow-lg">
                <Image src="https://picsum.photos/600/400" width={150} height={150} alt="terserah"/>
                <div className="text-white p-4">
                  <h1 className="font-bold">Lorem Ipsum Dolor Amet</h1>
                  <p className="text-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.  ltrices mauris. Maecenas vitae mattis tellus.</p>
                </div>
              </div>
              <div className="flex bg-[#1F4172] rounded-md overflow-hidden shadow-lg">
                <Image src="https://picsum.photos/600/400" width={150} height={150} alt="terserah"/>
                <div className="text-white p-4">
                  <h1 className="font-bold">Lorem Ipsum Dolor Amet</h1>
                  <p className="text-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.  ltrices mauris. Maecenas vitae mattis tellus.</p>
                </div>
              </div>
              <div className="flex bg-[#1F4172] rounded-md overflow-hidden shadow-lg">
                <Image src="https://picsum.photos/600/400" width={150} height={150} alt="terserah"/>
                <div className="text-white p-4">
                  <h1 className="font-bold">Lorem Ipsum Dolor Amet</h1>
                  <p className="text-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.  ltrices mauris. Maecenas vitae mattis tellus.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
