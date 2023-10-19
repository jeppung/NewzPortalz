import Navbar from '@/components/navbar'
import { IUser } from '@/pages/login'
import { ISubsTransaction } from '@/pages/subscription'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'


interface ITransactionFilter {
  status: string
  sort: "createdAt"
  order: string
  date: {
    startDate: Date | undefined,
    endDate: Date
  }
}

const AdminTransaction = () => {

  const [transactions, setTransactions] = useState<ISubsTransaction[]>()
  const [filter, setFilter] = useState<ITransactionFilter>({
    status: "",
    sort: "createdAt",
    order: "desc",
    date: {
      startDate: undefined,
      endDate: new Date(new Date().setHours(23, 59, 59))
    }
  })
  const startDateRef = useRef<HTMLInputElement>(null)
  const endDateRef = useRef<HTMLInputElement>(null)

  const startDateFocusHandler = () => {
    startDateRef.current?.showPicker()
  }

  const endDateFocusHandler = () => {
    endDateRef.current?.showPicker()
  }

  const getTransactionsData = async () => {
    try {
      const res = await fetch(`http://localhost:6969/transactions?_expand=user&status_like=${filter.status}&_sort=${filter.sort}&_order=${filter.order}&createdAt_gte=${filter.date.startDate ? filter.date.startDate.toISOString() : ""}&createdAt_lte=${filter.date.endDate.toISOString()}`)
      if (!res.ok) {
        console.log(res.statusText)
      }
      const data = await res.json()
      setTransactions(data)
    } catch (e) {
      console.log(e)
    }
  }

  const updateUserData = async (transaction: ISubsTransaction) => {
    try {
      const res = await fetch(`http://localhost:6969/users/${transaction.userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          subscription: {
            type: "premium",
            expiredAt: transaction.user?.subscription.expiredAt == null ? moment().add(1, transaction.duration === "yearly" ? "year" : "month").toISOString() : moment(transaction.user?.subscription.expiredAt).add(1, transaction.duration === "yearly" ? "year" : "month").toISOString()
          }
        } as IUser),
        headers: {
          "Content-type": "application/json"
        }
      })
      if (!res.ok) {
        return alert(`An error occured while updating user data ${res.statusText}`)
      }
      const data = await res.json()
      console.log(data, "success")
    } catch (e) {
      return alert("An error occured while updating user data")
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
        return alert(`An error occured when updating transaction (${res.statusText})`)
      }

      if (action === "accept") {
        updateUserData(transaction)
      }

      const data = await res.json() as ISubsTransaction
      let dataIndex = transactions?.findIndex((transaction) => transaction.id === data.id)
      transactions![dataIndex!].status = data.status
      transactions![dataIndex!].updatedAt = data.updatedAt

      setTransactions([...transactions!])
    } catch (e) {
      return alert(`An error occured when updating transaction`)
    }
  }

  useEffect(() => {
    getTransactionsData()
  }, [filter])

  return (
    <>
      <Navbar />
      <main className='max-w-7xl mx-auto pt-10'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl'>Transactions</h1>
          <div className='flex gap-x-5'>
            <select name="transaction_filter" id="transaction_filter" className='p-2 rounded-md border' value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
              <option value="">All</option>
              <option value="cancelled">Cancelled</option>
              <option value="cancelled">Completed</option>
              <option value="pending">Pending</option>
              <option value="waiting payment">Waiting payment</option>
            </select>
            <div className=' flex items-center'>
              <div className='relative w-32 rounded-md bg-slate-200 flex items-center' onClick={startDateFocusHandler}>
                <label htmlFor="dateStart" className='absolute px-2 w-full text-end' >{filter.date.startDate ? moment(filter.date.startDate).format("MM/DD/YYYY") : "Start date"}</label>
                <input type="date" name="dateStart" id="dateStart" ref={startDateRef} className='absolute invisible' onChange={(e) => {
                  if (e.target.valueAsDate === null) return setFilter({ ...filter, date: { ...filter.date, startDate: undefined } })
                  setFilter({ ...filter, date: { ...filter.date, startDate: e.target.valueAsDate } })
                }} />
              </div>
              <p>-</p>
              <div className='relative w-32 rounded-md bg-slate-200 flex items-center' onClick={endDateFocusHandler}>
                <label htmlFor="dateEnd" className='absolute px-2  w-full text-start' >{moment(filter.date.endDate).format("MM/DD/YYYY")}</label>
                <input type="date" name="dateEnd" id="dateEnd" ref={endDateRef} className='absolute invisible' onChange={(e) => {
                  if (e.target.valueAsDate === null) return setFilter({ ...filter, date: { ...filter.date, endDate: new Date(new Date().setHours(23, 59, 59)) } })
                  setFilter({ ...filter, date: { ...filter.date, endDate: new Date(e.target.valueAsDate!.setHours(23, 59, 59)) } })
                }} />
              </div>
            </div>
            <select name="order" id="order" className='p-2 rounded-md border' value={filter.order} onChange={(e) => setFilter({ ...filter, order: e.target.value })}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
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
                      <td className='p-2'>{moment(transaction.createdAt).format("MM-DD-YYYY HH:mm:ss")}</td>
                      <td className='p-2'>{moment(transaction.updatedAt).format("MM-DD-YYYY HH:mm:ss")}</td>
                      {
                        (transaction.status === "waiting payment" || transaction.status === "pending") && <td className='p-2'>
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