import { useState } from "react";
import { pinPost } from "../services/postsService.js";
import ImageGrid from "./ImageGrid.jsx";
import { Ellipsis, Pencil, Pin, PinOff, OctagonX, MessageSquareWarning } from "lucide-react";

export default function Post({ isOwnPost, post, onImagePreview, onOptionSelect }) {
    const [optionsExpanded, setOptionsExpanded] = useState(false);

    //? Should I use "useMemo" for this? Ill figure it out later
    const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    });

    const handleOptionClick = async (action) => {
        setOptionsExpanded(false);
        let postId;
        if (action === "pin") {
            await handlePinPost();
        } else if (action === "delete") {
            postId = post.id;
        }
        onOptionSelect(action, postId);
    }

    const handlePinPost = async () => {
        try {
            await pinPost({ userId: post.user_id, postId: post.id});
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <article className="py-4 px-4 rounded-sm border border-gray-300 dark:border-white/20 relative">
            <div className="absolute top-2 right-2 z-20">
                <button className="cursor-pointer" onClick={() => setOptionsExpanded(!optionsExpanded)}>
                    <Ellipsis />
                </button>
                { optionsExpanded && (
                    <div className="absolute right-0 bg-white dark:bg-gray-900 border border-gray-300 dark:border-white/20 rounded-md shadow-lg w-32 md:w-36">
                        { isOwnPost && (
                            <button onClick={() => { handleOptionClick("pin") }} className="w-full flex items-center justify-start text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/5 p-2.5 text-sm md:text-xs cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition-[color]">
                                { post.is_pinned ? (
                                    <PinOff className="w-4 h-4 mr-2" />
                                ) : (
                                    <Pin className="w-4 h-4 mr-2" />
                                )}
                                <span>{ post.is_pinned ? "Unpin" : "Pin" }</span>
                            </button>
                        )}
                        { isOwnPost && (
                            <button onClick={() => { handleOptionClick("edit") }} className="w-full flex items-center justify-start text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/5 p-2.5 text-sm md:text-xs cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition-[color]">
                                <Pencil className="w-4 h-4 mr-2" />
                                <span>Edit</span>
                            </button>
                        )}
                        { isOwnPost && (
                            <button onClick={() => { handleOptionClick("delete") }} className="w-full flex items-center justify-start text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/5 p-2.5 text-sm md:text-xs cursor-pointer hover:text-red-500 dark:hover:red-blue-400 transition-[color]">
                                <OctagonX className="w-4 h-4 mr-2" />
                                <span>Delete</span>
                            </button>
                        )}
                        <button onClick={() => { handleOptionClick("report") }} className="w-full flex items-center justify-start text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/5 p-2.5 text-sm md:text-xs cursor-pointer hover:text-red-500 dark:hover:red-blue-400 transition-[color]">
                            <MessageSquareWarning className="w-4 h-4 mr-2" />
                            <span>Report</span>
                        </button>
                    </div>
                )}
            </div>

            <h1 className="flex items-center font-display text-lg text-gray-900 dark:text-gray-100 font-semibold">
                { post.is_pinned && (
                    <Pin className="w-3 h-3 mr-1 text-gray-700 dark:text-gray-300" />
                )}
                { post.title }
            </h1>
            <p className="text-sm/6 text-gray-700 dark:text-gray-300 my-1.5">
                { post.content }
            </p>
            {
                post.attachments && post.attachments.length > 0 && (
                    <ImageGrid attachments={post.attachments} onImageClick={onImagePreview} />
                )
            }
            {
                post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {post.tags.map((tag, index) => (
                            <span key={index} className="bg-gray-50 dark:bg-white/5  border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100 px-2 py-1 rounded-md text-xs font-mono italic">#{tag}</span>
                        ))}
                    </div>
                )
            }
            <span className="text-xs/6 text-gray-500 dark:text-gray-400 mt-2">{ formattedDate }</span>
        </article>
    )
}

/*
* TODO:
? - Add like functionality
? - Add comment functionality
? - Add edit post functionality
*/