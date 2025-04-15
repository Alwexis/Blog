import { supabase } from "../services/supabase.js";

export async function createUser({ username, email, password }) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { status: "error", message: error.message };
    
    const userId = data.user?.id;
    if (userId) {
        const { error: insertError } = await supabase.from("users").insert({
            id: userId,
            username,
            alias: username,
            bio: "",
            avatar_url: "",
            background_url: "",
            pinned_post_id: null,
        });

        if (insertError) return { status: "error", message: insertError.message };
    }
    return { status: "success", message: "User created successfully", user: { ...data.user, username } };
}