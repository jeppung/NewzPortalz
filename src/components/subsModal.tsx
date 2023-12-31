import { BASE_URL } from '@/constants/url'
import { QRCodeSVG } from 'qrcode.react'
import React from 'react'

interface ISubsModalProps {
    onClose: () => void,
    link: string
}

const SubsModal = ({ onClose, link }: ISubsModalProps) => {

    return (
        <dialog className='w-screen h-screen bg-slate-500/50 justify-center items-center flex fixed'>
            <div className='bg-white w-fit h-fit rounded-md p-10 md:p-16 relative overflow-auto flex flex-col items-center justify-center'>
                <button onClick={onClose} className='absolute right-5 top-3'>X</button>
                <QRCodeSVG value={`${BASE_URL}${link}`} size={200} />
                <h1 className='text-xl font-bold mt-10 text-center'>Scan QR To Proceed Payment</h1>
            </div>
        </dialog>
    )
}

export default SubsModal