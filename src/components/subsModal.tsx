import { QRCodeSVG } from 'qrcode.react'
import React from 'react'

interface ISubsModalProps {
    onClose: () => void,
    link: string
}

const SubsModal = ({ onClose, link }: ISubsModalProps) => {

    return (
        <dialog className='w-full h-full bg-slate-500/50 justify-center items-center flex'>
            <div className='bg-white w-[60%] h-[90%] rounded-md p-16 relative overflow-auto flex justify-center'>
                <button onClick={onClose} className='absolute right-5 top-3'>X</button>
                <QRCodeSVG value={`http://localhost:3000${link}`} size={200} />
            </div>
        </dialog>
    )
}

export default SubsModal