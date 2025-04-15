import { useParams } from "react-router-dom"
import { useProfile } from "../hooks/useProfile.js"
import { usePosts } from "../hooks/usePosts.js"
import { useAuth } from "../context/AuthContext.jsx"
import { useState } from "react";
import { CircleAlert, CirclePlus, Frown, Calendar, GalleryVertical } from "lucide-react"
import CreatePost from "../components/CreatePost.jsx";
import Post from "../components/Post.jsx";
import PreviewImage from "../components/PreviewImage.jsx";
import { deletePost } from "../services/postsService.js";
import DeletePost from "../components/DeletePost.jsx";
import Notification from "../components/Notification.jsx";

export default function Profile() {
    let { username } = useParams();
    if (username.startsWith("@")) {
        username = username.substring(1);
    }
    const { profile, loading: loadingProfile } = useProfile(username);
    const { posts, loading: loadingPosts, refresh: refreshPosts } = usePosts(profile?.id);
    const { user, loading } = useAuth();
    const [ creatingPost, setCreatingPost ] = useState(false);
    const [ previewImage, setPreviewImage ] = useState(null); // Ex: { actual: 0, images: [] }
    const [ deletingPost, setDeletingPost ] = useState(false);
    const [ notification, setNotification ] = useState(null);
    
    // Check if the user is loading or the profile is loading
    const isOwnProfile = user?.id === profile?.id;

    const formattedJoinDate = new Date(profile?.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long"
    });

    const handleModalClose = (success) => {
        setCreatingPost(false);
        if (success) {
            refreshPosts();
        }
    }

    const handleImagePreview = (index, images) => {
        setPreviewImage({ actual: index, images });
    }

    const handleOptionSelect = (option, postId = null) => {
        if (option === "pin") {
            refreshPosts();
        } else if (option === "delete" && postId) {
            setDeletingPost(postId)
        }
    }

    const handlePostElimination = async (confirm) => {
        console.log(deletingPost)
        if (confirm) {
            await deletePost({ userId: user.id, postId: deletingPost});
            refreshPosts();
            setNotification({ type: "error", message: "Post deleted successfully." })
        }
        setDeletingPost(false);
    }

    if (loading || loadingProfile) {
        return (
            <main className="w-dvw h-dvh flex items-center justify-center bg-white dark:bg-gray-900 text-zinc-950 dark:text-gray-100 p-4 overflow-hidden">
                <section className="max-w-72 md:max-w-md w-full flex flex-col items-center justify-center px-6 py-4 border border-gray-900/10 dark:border-white/10 rounded-md">
                    <CircleAlert className="w-8 h-8 animate-spin" />
                </section>
            </main>
        )
    }

    return (
        <main className="relative w-dvw h-dvh bg-white dark:bg-gray-900 text-zinc-950 dark:text-gray-100 overflow-x-hidden">
            {/* Image preview */}
            { previewImage && (
                <PreviewImage actual={previewImage.actual} images={previewImage.images} onClose={() => { setPreviewImage(null) }} />
            )}
            {/* Modal for new post */}
            { creatingPost && (
                <CreatePost onClose={handleModalClose} />
            ) }
            {/* Confirm post deletion */}
            { deletingPost && (
                <DeletePost onClose={handlePostElimination} />
            )}
            {/* Notification */}
            { notification && (
                <Notification {...notification} onClose={() => { setNotification(null) }} />
            )}
            {/* Content */}
            <section className="flex flex-col items-center">
                {/* User profile */}
                <section className="bg-white dark:bg-gray-900 flex flex-col items-center w-full">
                    <div className="relative h-30 md:h-40 w-full">
                        <div className="h-28 md:h-36 w-full bg-cover bg-center top-0" style={{ backgroundImage: `url("${profile.background_url}")` }}></div>
                        <div className="absolute h-28 md:h-36 w-full top-0 bg-linear-to-b/oklch from-white/20 md:from-black/20 from-80% to-white dark:to-gray-900 to-100%"></div>
                        <div className="absolute -bottom-2 md:-bottom-4 w-full px-2.5 flex items-center justify-center">
                            <div className="flex items-center justify-center h-20 w-20 md:h-28 md:w-28 rounded-full border-2 border-gray-200/75 dark:border-gray-950/75">
                                <img className="rounded-full" src={profile.avatar_url} alt={`${username}'s profile picture.`} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 mb-2 md:mb-4 md:mt-6 flex flex-col items-center w-[80%] md:w-md">
                        <h2 className="font-display text-xl text-gray-900 dark:text-gray-100 font-semibold">{profile.alias}</h2>
                        <h3 className="font-mono text-sm text-gray-600 dark:text-gray-400">@{username}</h3>
                        <p className="text-sm/6 text-gray-700 dark:text-gray-300 my-1.5 max-w-72 md:max-w-[90%]">{profile.bio}</p>
                        <div className="flex items-center justify-start space-x-4 max-w-72 md:max-w-[90%] w-full">
                            <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>Joined {formattedJoinDate}</span>
                            </div>
                            <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400 text-sm">
                                <GalleryVertical className="w-4 h-4" />
                                <span>Posts: {loadingPosts ? "Loading..." : posts.length}</span>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="w-[80%] md:w-md h-0.5 bg-gray-200 dark:bg-white/10 mx-auto"></div>
                <section className="w-[80%] md:w-lg py-4 h-full space-y-4 overflow-auto">
                    { loadingPosts && <CircleAlert className="w-8 h-8 animate-spin" /> }
                    { !loadingPosts && posts.length > 0 ? (
                        posts.map((post) => (
                            <Post key={post.id} onOptionSelect={handleOptionSelect} isOwnPost={isOwnProfile} post={post} onImagePreview={handleImagePreview} />
                        ))
                    ) :
                        <div className="flex flex-col items-center justify-center w-full h-full py-4 text-gray-900 dark:text-gray-100">
                            <h2 className="text-lg font-semibold">No posts yet</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{isOwnProfile ? `You have` : `This user has`} not posted anything yet.</p>
                            <Frown strokeWidth={1} className="text-gray-600 dark:text-gray-400 mt-4 w-8 h-8" />
                        </div>
                    }
                </section>
            </section>
            
            { isOwnProfile && (
                <button onClick={() => { setCreatingPost(true) }} type="button" className="fixed bottom-4 right-6 z-40 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-gray-200 rounded-full hover:scale-105 transition-all p-2 shadow-md cursor-pointer">
                    <CirclePlus />
                </button>
            )}
        </main>
    )
}

/*
? TO-DO:
* - Change the "loading" icon; maybe create a Spinner Component.
* - Add a "connections" section to the profile with an edit button.
* - Add an actual edit profile functionality.
    I'm thinking bout a view; but maybe a modal would be better.
* - Create tests with Jest and React Testing Library.
    - Test the Profile component with a mock profile.
    - Test the CreatePost component with a mock post.
*/