import { useEffect, useState, useCallback } from "react";
import { supabase } from "../services/supabase.js";

export const usePosts = (user_id) => {
    const [posts, setPosts] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPosts = useCallback(async () => {
        if (!user_id) return;

        setLoading(true);
        const { data, error } = await supabase.from("user_posts_with_pinned")
            .select(`
              *,
              post_like(count),
              post_comment(count)
            `)
            .eq("user_id", user_id)
            .order("is_pinned", { ascending: false })
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }
        setPosts(data);
        setLoading(false);
    }, [user_id])

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return { posts, loading, refresh: fetchPosts };
}