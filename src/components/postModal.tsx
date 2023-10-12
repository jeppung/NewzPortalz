
import { IPost } from '@/pages/admin/posts'
import { Editor } from '@tinymce/tinymce-react'
import React, { useState } from 'react'

interface IPostModalProps {
    onClose: () => void,
    onSuccess: (data: Omit<IPost, "user">) => void
}

const PostModal = ({onClose, onSuccess}: IPostModalProps) => {
    const [body, setBody] = useState("")
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")

    const slugHandler = () => {       
        return title.toLowerCase().split(" ").join("-")
    }

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let data: Omit<IPost, "user"> = {
            userId: 1,
            title: title,
            description: description,
            body: body,
            isPremium: false,
            likes: 0,
            shares: 0,
            slug: slugHandler()
        }

        try{
            const res = await fetch("http://localhost:6969/posts", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json"
                }
            })
            if(!res.ok) return alert("An error has occured")

            console.log(data, "success")
            onSuccess(data)
        }catch(e){
            return alert("An error has occured")
        }
    }

    
  return (
    <dialog open className='w-full h-full bg-slate-500/50 justify-center items-center flex'>
        <div className='bg-white w-[60%] h-[90%] rounded-md p-16 relative'>
            <button onClick={() => onClose()} className='absolute right-5 top-3'>X</button>
            <h1 className='text-3xl font-bold'>Create new post</h1>
            <form action="#" className='mt-10 flex flex-col gap-y-2' onSubmit={(e) => submitHandler(e)}>
                <div className='flex flex-col gap-y-2'>
                    <label htmlFor="title" className='text-lg'>Title</label>
                    <input onChange={(e) => setTitle(e.target.value)} type="text" name="title" id="title" className='border-2 p-2 rounded-md' placeholder='Post title' required/>
                </div>
                <div>
                </div>
                <div className='flex flex-col gap-y-2'>
                    <label htmlFor="slug" className='text-lg'>Slug</label>
                    <input value={slugHandler()} type="text" name="slug" id="slug" className='border-2 p-2 rounded-md' disabled required/>
                </div>
                <div className='flex flex-col gap-y-2'>
                    <label htmlFor="description" className='text-lg'>Description</label>
                    <input onChange={(e) => setDescription(e.target.value)} type="text" name="description" id="description" className='border-2 p-2 rounded-md' placeholder='Post description' required/>
                </div>
                <div className='mt-2'>
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
