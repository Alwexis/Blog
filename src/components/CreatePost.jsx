import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { createPost } from "../services/postsService";
import { X } from "lucide-react";

export default function CreatePost({ onClose }) {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        tags: [],
        images: []
    });
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const { user } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleImages = (e) => {
        let files = [];
        for (let x = 0; x < e.target.files.length; x++) {
            // more than 5mb not allowed
            if (e.target.files[x].size <= 5 * 1024 * 1024) {
                files.push(e.target.files[x]);
            }
            if (x > 4) break;
        }
        const urls = files.map(file => URL.createObjectURL(file));
        fileInputRef.current.files = null;
        setImageUrls(urls);
        setFormData({ ...formData, images: files });
    }

    const handleDeleteImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index).slice(0, 4);
        const newUrls = imageUrls.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
        setImageUrls(newUrls);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // returns an object
            await createPost({
                userId: user.id,
                title: formData.title,
                content: formData.content,
                tags: formData.tags.length > 0 ? formData.tags.replace("#", "").replace(" ", "-").split(",") : [],
                files: formData.images
            });
            onClose(true);
        } catch (error) {
            console.error(error);
            onClose(false);
        }
    };

    return (
        <section className="fixed bg-black/60 h-dvh w-dvw flex items-center justify-center z-50 animate-fade animate-duration-[200ms]">
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-y-4 max-w-80 md:max-w-md w-full px-6 py-4 bg-neutral-100 dark:bg-gray-900 border border-gray-900/10 dark:border-white/10 rounded-md shadow-md">
                <h2 className="text-base/7 font-display font-bold text-gray-900 dark:text-white">Create a new post</h2>
                <div className="w-full">
                    <label htmlFor="title" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Title <span className="text-red-400">*</span></label>
                    <input name="title" id="title" type="text" placeholder="Post title" onChange={handleChange} className="mt-2 block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 transition-all ease-in-out" />
                </div>
                <div className="w-full">
                    <label htmlFor="content" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Content <span className="text-red-400">*</span></label>
                    <textarea name="content" placeholder="Content" onChange={handleChange} className="mt-2 block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 transition-all ease-in-out"></textarea>
                </div>
                <div className="w-full">
                    <label htmlFor="tags" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Tags</label>
                    <textarea cols={1} rows={1} name="tags" placeholder="Tags separated by ," onChange={handleChange} className="mt-2 block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 transition-all ease-in-out"></textarea>
                </div>
                <div className="w-full">
                    <label htmlFor="images" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Images</label>
                    { formData.images.length == 0 && (
                        <>
                            <input accept="image/*" ref={fileInputRef} type="file" name="images" multiple onChange={handleImages} className="mt-2 block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 transition-all ease-in-out font-display cursor-pointer" />
                            <p className="text-sm/6 text-gray-600 dark:text-gray-400">
                                Max. 4 files; PNG, JPG, WEBP, GIF up to 5MB.
                            </p>
                        </>
                    )}
                </div>
                {/* Images showcase */}
                { formData.images.length > 0 && (
                    <div className="py-1.5 grid grid-cols-4 gap-6">
                        {
                            imageUrls.map((image, index) => (
                                <div style={{ animationDelay: `${index * 50}ms` }} className="group animate-fade relative w-16 h-16 rounded-sm overflow-hidden" key={index}>
                                    <img src={image} alt={`Preview ${index}`} className="w-16 h-16 aspect-square object-contain rounded-sm z-10" />
                                    <button type="button" onClick={() => { handleDeleteImage(index) }} className="cursor-pointer absolute top-0 bg-neutral-200/50 dark:bg-gray-900/50 h-full w-full z-20 opacity-0 group-hover:opacity-100 transition-all ease-in-out">
                                        <X className="m-auto" />
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                )}
                <section className="flex items-center justify-between w-full font-display">
                    <button aria-disabled={loading} disabled={loading} type="button" onClick={() => { onClose(false) }} className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:not-disabled:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 cursor-pointer transition-all ease-in-out disabled:cursor-not-allowed disabled:opacity-60">Cancel</button>
                    <button aria-disabled={formData.title === '' || formData.content === '' || loading} disabled={formData.title === '' || formData.content === ''} type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:not-disabled:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer transition-all ease-in-out disabled:cursor-not-allowed disabled:opacity-60">{ loading ? 'Uploading post...' : 'Create Post' }</button>
                </section>
            </form>
        </section>
    )
}