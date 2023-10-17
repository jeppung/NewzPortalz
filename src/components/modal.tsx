import React from 'react'

export interface IModalProps {
    onClose: () => void
    data?: object
    component: JSX.Element
}

const Modal = ({ onClose, data, component }: IModalProps) => {
    return (
        <dialog className='w-full h-full bg-slate-500/50 justify-center items-center flex'>
            <div className='bg-white w-fit h-fit rounded-md px-16 py-8 relative overflow-auto flex flex-col items-center justify-center'>
                <button onClick={onClose} className='absolute right-5 top-3'>X</button>
                {component}
            </div>
        </dialog>
    )
}

export default Modal