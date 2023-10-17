import Navbar from '@/components/navbar'
import { ISubsTransaction } from '@/pages/subscription'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

const AdminTransaction = () => {

  const [transactions, setTransactions] = useState<ISubsTransaction[]>()

  const getTransactionsData = async () => {
    try {
      const res = await fetch("http://localhost:6969/transactions?_expand=user")
      if (!res.ok) {
        console.log(res.statusText)
      }
      const data = await res.json()
      setTransactions(data)
    } catch (e) {
      console.log(e)
    }
  }

  const actionHandler = async (transaction: ISubsTransaction, action: string) => {
    const isConfirm = confirm(`Are you sure to ${action} this transaction ?`)
    if (!isConfirm) return

    try {
      const res = await fetch(`http://localhost:6969/transactions/${transaction.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: action === "accept" ? "completed" : "cancelled",
          updatedAt: new Date().toISOString()
        } as ISubsTransaction),
        headers: {
          "Content-type": "application/json"
        }
      })

      if (!res.ok) {
        return alert(res.statusText)
      }

      const data = await res.json() as ISubsTransaction

      let dataIndex = transactions?.findIndex((transaction) => transaction.id === data.id)
      transactions![dataIndex!].status = data.status
      transactions![dataIndex!].updatedAt = data.updatedAt

      setTransactions([...transactions!])
    } catch (e) {
      return alert("An error has occured")
    }
  }

  useEffect(() => {
    getTransactionsData()
  }, [])

  return (
    <>
      <Navbar />
      <main className='max-w-7xl mx-auto pt-10'>
        <h1 className='text-3xl'>Transactions</h1>
        <section className='mt-5 '>
          <table className='w-full table border border-collapse'>
            <thead className='bg-green-500 text-white'>
              <tr>
                <th className='p-2 text-start'>No</th>
                <th className='p-2 text-start'>Subscription</th>
                <th className='p-2 text-start'>Duration</th>
                <th className='p-2 text-start'>User</th>
                <th className='p-2 text-start'>Status</th>
                <th className='p-2 text-start'>Created At</th>
                <th className='p-2 text-start'>Updated At</th>
                <th className='p-2 text-start'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                transactions?.map((transaction, i) => {
                  return (
                    <tr key={i} className='border'>
                      <td className='p-2'>{i + 1}</td>
                      <td className='p-2'>{transaction.type}</td>
                      <td className='p-2'>{transaction.duration}</td>
                      <td className='p-2'>{transaction.user?.name}</td>
                      <td className='p-2'>{transaction.status}</td>
                      <td className='p-2'>{moment(transaction.createdAt).format("MM-DD-YYYY HH:mm")}</td>
                      <td className='p-2'>{moment(transaction.updatedAt).format("MM-DD-YYYY HH:mm")}</td>
                      {
                        transaction.status === "waiting payment" || transaction.status === "pending" && <td className='p-2'>
                          <div className='flex gap-x-2'>
                            <button onClick={() => actionHandler(transaction, "reject")} className='bg-red-400 text-white px-5 rounded-md'>Rej</button>
                            <button onClick={() => actionHandler(transaction, "accept")} className='bg-green-400 text-white px-5 rounded-md'>Acc</button>
                          </div>
                        </td>
                      }
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </section>
      </main>
    </>
  )
}

export default AdminTransaction