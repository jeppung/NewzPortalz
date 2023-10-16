import Navbar from '@/components/navbar'
import { getCookie } from 'cookies-next'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { IUser } from '../login'
import { useRouter } from 'next/router'
import SubsModal from '@/components/subsModal'



export interface ISubsTransaction {
    id?: number
    userId: number
    type: "free" | "premium"
    duration: "monthly" | "yearly" | null
    price: number
    status: "pending" | "completed" | "cancelled" | "waiting payment"
    createdAt: string
    updatedAt: string
    user?: IUser
}


export const encrypt = (data: object) => {
    const CryptoJS = require("crypto-js");
    return CryptoJS.AES.encrypt(JSON.stringify(data), 'n3wzP0rt4lzk3yzz').toString()
}

export const decrypt = (cipher: string): object => {
    const CryptoJS = require("crypto-js");
    var bytes = CryptoJS.AES.decrypt(cipher, 'n3wzP0rt4lzk3yzz');
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return decryptedData
}


const Subscription = () => {
    const [userData, setUserData] = useState<IUser | null>()
    const [transactionLink, setTransactionLink] = useState<string>()
    const [isModal, setIsModal] = useState<boolean>(false)

    const subscriptionHandler = async (duration: "yearly" | "monthly") => {
        const isConfirm = confirm("Are you sure to buy this subscription plan ?")
        if(!isConfirm) return

        const currDate = new Date()
        const data: ISubsTransaction = {
            userId: userData?.id!,
            type: "premium",
            price: duration === "monthly" ? 25000 : 225000,
            duration: duration,
            status: "waiting payment",
            createdAt: currDate.toISOString(),
            updatedAt: currDate.toISOString()
        }

        try {
            const res = await fetch("http://localhost:6969/transactions", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json"
                }
            })
            const resData = await res.json() as ISubsTransaction
            const cipher = encrypt(resData)
            setTransactionLink(`/transaction/${btoa(cipher)}`)
            setIsModal(true)
        } catch (e) {
            alert("An error has occured")
        }
    }

    useEffect(() => {
        setUserData(JSON.parse(getCookie("userData")!) as IUser)
    }, [])

    return (
        <div className='flex flex-col h-screen w-full'>
            {
                isModal && transactionLink && <SubsModal onClose={() => setIsModal(false)} link={transactionLink} />
            }
            <Navbar />
            <main className='bg-[#112D4E] flex-1 pt-[50px]'>
                <section className='max-w-7xl mx-auto'>
                    <div className='bg-[#F9F7F7]  w-full rounded-2xl py-[80px] px-[50px] flex'>
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
                                        <h1 className='text-5xl mt-[10px] font-bold'>25000<span className='text-sm'>/month</span></h1>
                                        <div className='mt-5 h-[1px] w-full bg-black'></div>
                                    </div>
                                    <div className='flex-1 px-5 text-sm'>
                                        <p className='font-bold'>✓ Unlock premium post</p>
                                    </div>
                                    <button onClick={() => subscriptionHandler('monthly')} className='text-center bg-[#112D4E] py-[8px] text-white font-bold rounded-md'>I want this</button>
                                </div>
                                <div className='bg-[#DEDEDE] w-[277px] h-[413px] p-[28px] rounded-2xl flex flex-col mt-[40px] shadow-lg border border-black'>
                                    <div className='flex-1'>
                                        <h1 className='text-[36px]'>Yearly</h1>
                                        <h1 className='text-5xl mt-[10px] font-bold'>225000<span className='text-sm'>/year</span></h1>
                                        <div className='mt-5 h-[1px] w-full bg-black'></div>
                                    </div>
                                    <div className='flex-1 px-5 text-sm'>
                                        <p className='font-bold'>✓ Unlock premium post</p>
                                    </div>
                                    <button onClick={() => subscriptionHandler('yearly')} className='text-center bg-[#112D4E] py-[8px] text-white font-bold rounded-md'>I want this</button>
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