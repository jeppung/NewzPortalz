import { ISubsTransaction, decrypt } from '@/pages/subscription'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const Transaction = () => {
    const router = useRouter()
    const [transaction, setTransaction] = useState<ISubsTransaction>()


    useEffect(() => {
        if (router.query.data !== undefined) {
            try {
                const chiper = atob(router.query.data as string)
                const transcationData = decrypt(chiper) as ISubsTransaction
                setTransaction(transcationData)
            } catch (e) {
                alert("An error has occured")
                router.push("/")
            }
        }
    }, [router])

    return (
        <div className='bg-[#112D4E] w-screen h-screen flex justify-center items-center'>
            <div >
                <h1 className='text-3xl text-white font-bold text-center'>Payment Process</h1>
                <div className='bg-[#F9F7F7] w-[400px] h-fit rounded-2xl mt-5 py-7 px-8'>
                    <div className='flex flex-col gap-y-3'>
                        <div>
                            <h1 className='font-bold text-lg'>Transaction ID</h1>
                            <p className='text-sm'>{transaction?.id}</p>
                        </div>
                        <div>
                            <h1 className='font-bold text-lg'>Subscription Type</h1>
                            <p className='text-sm'>{transaction?.type.split("").map((x, i) => i === 0 ? x.toUpperCase() : x)}</p>
                        </div>
                        <div>
                            <h1 className='font-bold text-lg'>Subscription Duration</h1>
                            <p className='text-sm'>{transaction?.duration?.split("").map((x, i) => i === 0 ? x.toUpperCase() : x)}</p>
                        </div>
                        <div>
                            <h1 className='font-bold text-lg'>Subscription Duration</h1>
                            <p className='text-sm'>{moment().add(1, "month").format("DD MMMM YYYY")}</p>
                        </div>
                    </div>
                    <div className='flex justify-between mt-10'>
                        <p className='font-bold self-end'>Total</p>
                        <h1 className='font-bold text-3xl'>25000</h1>
                    </div>
                    <input className='mt-5 border w-full rounded-md text-sm border-black py-2 px-2 text-md' type="number" name="amount" id="amount" placeholder='Input your money...' />
                    <button className='bg-[#112D4E] w-full mt-5 py-2 text-sm font-bold text-white rounded-md'>Pay</button>
                </div>
            </div>
        </div>
    )
}

export default Transaction