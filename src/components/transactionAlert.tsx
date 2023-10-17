import { ISubsTransaction } from '@/pages/subscription';
import React from 'react'
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';

interface ITransactionAlertProps {
    status: boolean
    data?: ISubsTransaction | undefined
    onOk: (status: boolean) => void
}

const TransactionAlert = ({ status, data, onOk }: ITransactionAlertProps) => {


    return (
        <div className='flex flex-col items-center'>
            {status ? <AiFillCheckCircle size={100} /> : <AiFillCloseCircle size={100} />}
            <h1 className='text-3xl font-bold mt-5'>{status ? "Payment Success" : "Payment Failed"}</h1>
            <p>{status ? "Your transaction will be processed" : "Your transaction is failed"}</p>
            {
                data && <div className='mt-10 self-start w-full'>
                    <h1 className='text-xl font-bold'>Invoice</h1>
                    <table className='w-full mt-5'>
                        <thead>
                            <tr>
                                <th className='w-96 text-start'>Item</th>
                                <th className='text-start'>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{data.type} ({data.duration}) subscription</td>
                                <td>{data.price}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='mt-5 flex justify-between'>
                        <p className='font-bold'>Total</p>
                        <p>{data.price}</p>
                    </div>
                </div>
            }
            <button onClick={() => onOk(status)} className='mt-10 w-full bg-[#112D4E] text-white font-bold py-2 rounded-md'>OK</button>
        </div>
    )
}

export default TransactionAlert