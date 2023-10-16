import Navbar from '@/components/navbar'
import Image from 'next/image'
import React from 'react'

const Subscription = () => {
    return (
        <div className='flex flex-col h-screen w-full'>
            <Navbar />
            <main className='bg-[#112D4E] flex-1 py-[50px]'>
                <section className='max-w-7xl mx-auto'>
                    <div className='bg-[#F9F7F7] h-[738px] w-full rounded-2xl py-[100px] px-[50px] flex'>
                        <div className='w-full flex flex-col justify-center gap-y-3'>
                            <Image src="/group-team.png" alt='group-team' width={500} height={0} />
                            <div className=''>
                                <h1 className='text-5xl font-bold'>Be part of us</h1>
                                <p className='mt-1 text-lg'>Lets read and read and read more</p>
                            </div>
                        </div>
                        <div className='w-full'>
                            <h1 className='text-[36px] text-center'>Subscription</h1>
                            <div className='flex gap-x-5'>
                                <div className='bg-[#DEDEDE] w-[277px] h-[413px] p-[28px] rounded-2xl flex flex-col mt-[40px] shadow-lg border border-black'>
                                    <div className='flex-1'>
                                        <h1 className='text-[36px]'>Monthly</h1>
                                        <h1 className='text-5xl mt-[10px] px-[28px] font-bold'>25000<span className='text-sm'>/month</span></h1>
                                    </div>
                                    <div className='flex-1'>
                                        <p className='font-bold'>v Unlock premium post</p>
                                    </div>
                                    <button className='text-center bg-[#112D4E] py-[8px] text-white font-bold rounded-md'>I want this</button>
                                </div>
                                <div className='bg-[#DEDEDE] w-[277px] h-[413px] p-[28px] rounded-2xl flex flex-col mt-[40px] shadow-lg border border-black'>
                                    <div className='flex-1'>
                                        <h1 className='text-[36px]'>Monthly</h1>
                                        <h1 className='text-5xl mt-[10px] px-[20px] font-bold'>225000<span className='text-sm'>/year</span></h1>
                                    </div>
                                    <div className='flex-1'>
                                        <p className='font-bold'>v Unlock premium post</p>
                                    </div>
                                    <button className='text-center bg-[#112D4E] py-[8px] text-white font-bold rounded-md'>I want this</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Subscription