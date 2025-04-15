import { supabase } from "./supabase";
import { uploadImages } from "./cloudinary";

export async function createPost({ userId, title, content, tags = [], files = [] }) {
    let attachments = [];
    if (files.length > 0) {
        attachments = await uploadImages(files);
    }

    const { data, error } = await supabase.from("user_post").insert([{
        user_id: userId,
        title,
        content,
        tags: tags,
        attachments: attachments,
    }]).single();

    if (error) throw error;
    return data;
}

export async function updatePost({ userId, postId, title, content, tags = [], files = [] }) {
    await assertUserOwnsPost(userId, postId);

    let attachments = [];
    if (files.length > 0) {
        attachments = await uploadImages(files);
    }

    const { data, error } = await supabase.from("user_post")
        .update({ title, content, tags, attachments })
        .eq("id", postId)
        .single();
    
    if (error) throw error;
    return data;
}

export async function deletePost({ userId, postId }) {
    await assertUserOwnsPost(userId, postId);

    // Is the post pinned?
    const { data: pinnedPost, error: pinnedPostError } = await supabase.from("users")
        .select("pinned_post_id")
        .eq("id", userId)
        .single();
    if (pinnedPostError) {
        supabase.from("users").update({ pinned_post_id: null }).eq("id", userId).single();
    }

    const { data, error } = await supabase.from("user_post").delete().eq("id", postId).single();
    if (error) throw error;
    return data;
}

export async function pinPost({ userId, postId }) {
    // Validar que el usuario es el propietario del post
    await assertUserOwnsPost(userId, postId);

    const { data: pinnedPost, error: pinnedPostError } = await supabase.from("users")
        .select("pinned_post_id")
        .single();
    if (pinnedPostError) throw pinnedPostError;

    if (pinnedPost && pinnedPost.pinned_post_id === postId) {
        // El post ya está fijado, lo desanclamos
        const { data, error } = await supabase.from("users")
            .update({ pinned_post_id: null })
            .eq("id", userId)
            .single();
        if (error) throw error;
        return { action: "unpin" };
    }

    // Fijamos el nuevo post
    const { data, error } = await supabase.from("users")
        .update({ pinned_post_id: postId })
        .eq("id", userId)
        .single();

    if (error) throw error;
    return { action: "pin" };
}

async function assertUserOwnsPost(userId, postId) {
    const { data, error } = await supabase.from("user_post").select("user_id").eq("id", postId).single();
    if (error) throw error;
    if (data.user_id !== userId) throw new Error("You are not the owner of this post.");
}