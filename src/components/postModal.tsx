
import { IPost, PostCategory } from '@/pages/admin/posts'
import { Editor } from '@tinymce/tinymce-react'
import React, { useState } from 'react'

interface IPostModalProps {
    type: "create" | "edit"
    onClose: () => void,
    onSuccess: (data: Omit<IPost, "user">) => void
    initialData?: IPost
}

interface IUploadImage {
    url: string
}

const PostModal = ({ onClose, onSuccess, type, initialData }: IPostModalProps) => {
    const [body, setBody] = useState(initialData ? initialData.body : "")
    const [slug, setSlug] = useState(initialData ? initialData.slug : "")
    const [title, setTitle] = useState<string>(initialData ? initialData.title : "")
    const [description, setDescription] = useState<string>(initialData ? initialData.description : "")
    const [postType, setPostType] = useState<string>(initialData ? initialData.isPremium ? "premium" : "free" : "free")
    const [category, setCategory] = useState<PostCategory>(initialData ? initialData.category : "technology")
    const [image, setImage] = useState<File | string | undefined>(initialData && initialData.thumbnail)
    const [uniqueId, _] = useState(initialData ? initialData.slug.split("-")[initialData.slug.split("-").length - 1] : crypto.randomUUID().split("-")[0])

    const slugHandler = (text: string) => {
        let processedText = text.toLowerCase().split(" ")
        processedText[processedText.length] = uniqueId
        return setSlug(processedText.join("-"))
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
            thumbnailUrl = typeof image === "string" ? initialData!.thumbnail : (await photoUploadHandler()).url
        } catch (e) {
            return alert("Error uploading thumbnail")
        }

        const currentDate = new Date()

        let data: Omit<IPost, "user"> = {
            userId: 1,
            title: title,
            description: description,
            thumbnail: thumbnailUrl,
            body: body!,
            isPremium: postType === "premium" ? true : false,
            category: category,
            likes: initialData ? initialData.likes : 0,
            shares: initialData ? initialData.shares : 0,
            slug: slug,
            createdAt: type === "create" ? currentDate.toISOString() : initialData!.createdAt,
            updatedAt: currentDate.toISOString()
        }

        try {
            const res = await fetch(type === "create" ? "http://localhost:6969/posts" : `http://localhost:6969/posts/${initialData?.id}`, {
                method: type === "create" ? "POST" : "PATCH",
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
                <h1 className='text-3xl font-bold'>{type === "create" ? "Create new post" : "Edit post"}</h1>
                <form action="#" className='mt-7 flex flex-col gap-y-3 ' onSubmit={(e) => submitHandler(e)}>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="title" className='text-lg'>Title</label>
                        <input onChange={(e) => {
                            setTitle(e.target.value)
                            slugHandler(e.target.value.trim())
                        }} value={title} type="text" name="title" id="title" className='border-2 p-2 rounded-md' placeholder='Post title' required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="slug" className='text-lg'>Slug</label>
                        <input value={slug} type="text" name="slug" id="slug" className='border-2 p-2 rounded-md' disabled required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="description" className='text-lg'>Description</label>
                        <input onChange={(e) => setDescription(e.target.value)} value={description} type="text" name="description" id="description" className='border-2 p-2 rounded-md' placeholder='Post description' required />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="category" className='text-lg'>Category</label>
                        <select onChange={(e) => setCategory(e.target.value as PostCategory)} value={category} name="category" id="category" className='border-2 p-2 rounded-md' required>
                            <option value="technology">Technology</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="politics">Politics</option>
                            <option value="sports">Sports</option>
                            <option value="others">Others</option>
                        </select>
                    </div>
                    <div className='flex justify-between'>
                        <div className='flex flex-col gap-y-2'>
                            <label htmlFor="thumbnail" className='text-lg'>Thumbnail</label>
                            <input type="file" name="thumbnail" id="thumbnail" onChange={(e) => e.target.files?.length === 1 && imageHandler(e.target.files)} />
                        </div>
                        {
                            image && <div>
                                <img src={typeof image === "string" ? image : URL.createObjectURL(image)} className='h-52' alt="" />
                            </div>
                        }

                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="type" className='text-lg'>Type</label>
                        <select className='border-2 p-2 rounded-md bg-white' onChange={(e) => setPostType(e.target.value)} value={postType}>
                            <option value="free">Free</option>
                            <option value="premium">Premium</option>
                        </select>
                    </div>
                    <div className='mt-2 flex-1'>
                        <Editor
                            initialValue={initialData?.body}
                            init={{
                                max_height: 250,
                                menubar: false,
                                resize: false,
                                placeholder: "Write your content here...",
                                toolbar: "undo redo | h1 h2 | bold italic underline | blockquote | aligncenter alignjustify alignleft alignright "
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
