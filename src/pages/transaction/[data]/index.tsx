import { ISubsTransaction, decrypt } from '@/pages/subscription'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const Transaction = () => {
    const router = useRouter()
    const [transaction, setTransaction] = useState<ISubsTransaction>()


    useEffect(() => {
        console.log(router.query.data)

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
        <div>
            <h1>{transaction?.price}</h1>
        </div>
    )
}

export default Transaction