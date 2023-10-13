
import { IPost } from '@/pages/admin/posts'
import { Editor } from '@tinymce/tinymce-react'
import React, { useState } from 'react'

interface IPostModalProps {
    onClose: () => void,
    onSuccess: (data: Omit<IPost, "user">) => void
}

interface IUploadImage {
    url: string
}

const PostModal = ({ onClose, onSuccess }: IPostModalProps) => {
    const [body, setBody] = useState("")
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [type, setType] = useState<string>("free")
    const [image, setImage] = useState<File>()

    const slugHandler = () => {
        return title.toLowerCase().split(" ").join("-")
    }

    const photoUploadHandler = async (): Promise<IUploadImage> => {
        const formData = new FormData()
        formData.append("file", image!)
        formData.append("upload_preset", "zcjxhynp")

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dylzfyn4b/upload", {
                method: "POST",
                body: formData
            })
            if (!res.ok) {
                throw new Error("An error has occured")
            }
            return res.json()
        } catch (e) {
            throw new Error("An error has occured")
        }
    }

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let thumbnailUrl = ""

        try {
            thumbnailUrl = (await photoUploadHandler()).url
        } catch (e) {
            return alert("Error uploading thumbnail")
        }


        let data: Omit<IPost, "user"> = {
            userId: 1,
            title: title,
            description: description,
            thumbnail: thumbnailUrl,
            body: body,
            isPremium: type === "premium" ? true : false,
            likes: 0,
            shares: 0,
            slug: slugHandler()
        }

        try {
            const res = await fetch("http://localhost:6969/posts", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json"
                }
            })
            if (!res.ok) return alert("An error has occured")

            onSuccess(data)
        } catch (e) {
            return alert("An error has occured")
        }
    }

    const imageHandler = (data: FileList) => {
        setImage(data[0])
    }


    return (
        <dialog open className='w-full h-full bg-slate-500/50 justify-center items-center flex'>
            <div className='bg-white w-[60%] h-[90%] rounded-md p-16 relative overflow-auto'>
                <button onClick={() => onClose()} className='absolute right-5 top-3'>X</button>
                <h1 className='text-3xl font-bold'>Create new post</h1>
                <form action="#" className='mt-7 flex flex-col gap-y-3 ' onSubmit={(e) => submitHandler(e)}>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="title" className='text-lg'>Title</label>
                        <input onChange={(e) => setTitle(e.target.value)} type="text" name="title" id="title" className='border-2 p-2 rounded-md' placeholder='Post title' required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="slug" className='text-lg'>Slug</label>
                        <input value={slugHandler()} type="text" name="slug" id="slug" className='border-2 p-2 rounded-md' disabled required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="description" className='text-lg'>Description</label>
                        <input onChange={(e) => setDescription(e.target.value)} type="text" name="description" id="description" className='border-2 p-2 rounded-md' placeholder='Post description' required />
                    </div>
                    <div className='flex justify-between'>
                        <div className='flex flex-col gap-y-2'>
                            <label htmlFor="thumbnail" className='text-lg'>Thumbnail</label>
                            <input type="file" name="thumbnail" id="thumbnail" required onChange={(e) => e.target.files?.length === 1 && imageHandler(e.target.files)} />
                        </div>
                        {
                            image && <div>
                                <img src={URL.createObjectURL(image!)} className='h-52' alt="" />
                            </div>
                        }

                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="type" className='text-lg'>Type</label>
                        <select className='border-2 p-2 rounded-md bg-white' onChange={(e) => setType(e.target.value)} value={type}>
                            <option value="free">Free</option>
                            <option value="premium">Premium</option>
                        </select>
                    </div>
                    <div className='mt-2 flex-1'>
                        <Editor
                            init={{
                                max_height: 250,
                                menubar: false,
                                resize: false,
                                placeholder: "Write your content here..."
                            }}
                            onEditorChange={(content) => {
                                setBody(content)
                            }}
                        />
                    </div>
                    <button type='submit' onClick={() => console.log(body)} className='bg-blue-500 rounded-md py-2 text-white'>Submit</button>
                </form>
            </div>
        </dialog>
    )
}

export default PostModal
