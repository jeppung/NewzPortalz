
import { Editor } from '@tinymce/tinymce-react'
import React, { useState } from 'react'

interface IPostModalProps {
    onClose: () => void
}

const PostModal = ({onClose}: IPostModalProps) => {
    const [body, setBody] = useState("")
  return (
    <dialog open className='w-full h-full bg-slate-500/50 justify-center items-center flex'>
        <div className='bg-white w-[60%] h-[90%] rounded-md p-16 relative'>
            <button onClick={onClose} className='absolute right-5 top-3'>X</button>
            <h1 className='text-3xl font-bold'>Create new post</h1>
            <form action="#" className='mt-10 flex flex-col gap-y-2'>
                <div className='flex flex-col gap-y-2'>
                    <label htmlFor="title" className='text-lg'>Title</label>
                    <input type="text" name="title" id="title" className='border-2 p-2 rounded-md' placeholder='Post title' required/>
                </div>
                <div>
                </div>
                <div className='flex flex-col gap-y-2'>
                    <label htmlFor="slug" className='text-lg'>Slug</label>
                    <input type="text" name="slug" id="slug" className='border-2 p-2 rounded-md' disabled required/>
                </div>
                <div className='flex flex-col gap-y-2'>
                    <label htmlFor="description" className='text-lg'>Description</label>
                    <input type="text" name="description" id="description" className='border-2 p-2 rounded-md' placeholder='Post description' required/>
                </div>
                <div className='bg-red-200 overflow-y-hidden mt-2 flex-1'>
                    <Editor
                    init={{ 
                        max_height: 300,
                        menubar: false,
                        resize: false,
                        placeholder: "Write your content here..."
                    }}
                    onEditorChange={(content, editor) => {
                        setBody(content)
                    }}
                >

                </Editor>
                </div>
                <button type='submit' onClick={() => console.log(body)} className='bg-blue-500 rounded-md py-2 text-white'>Submit</button>
            </form>
        </div>
    </dialog>
  )
}

export default PostModal
