import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase.js";
import { createUser } from "../services/auth.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = supabase.auth.getSession().then(({ data }) => {
            setUser(data?.session?.user || null);
            setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => setUser(session?.user || null)
        );

        return () => listener?.subscription.unsubscribe();
    }, []);

    const signUp = async (credentials) => {
        const result = await createUser(credentials);
        return result;
    };

    const signIn = async (email, password) => {
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (!result.error) {
            const { data } = await supabase
                .from("users")
                .select("*")
                .eq("id", result.data.user.id)
                .single();
            return { status: "success", user: data };
        }
        return { status: "error", error_code: result.error.code, error: result.error.message };
    }

    const signOut = () => supabase.auth.signOut();

    return (
        <AuthContext.Provider
            value={{ user, loading, signUp, signIn, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
