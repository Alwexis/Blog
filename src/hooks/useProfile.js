import { useEffect, useState } from "react";
import { supabase } from "../services/supabase.js";

export const useProfile = (username) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) return;

        let mounted = true;
        setLoading(true);
        supabase.from("users").select("*").eq("username", username).single().then(({ data, error }) => {;
            if (mounted) {
                if (!error) setProfile(data);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
        }
    }, [username]);

    return { profile, loading };
}