import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Notification from "../components/Notification";
import { CircleAlert, EyeOff, Eye } from "lucide-react";

export default function SignUp() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [seePwd, setSeePwd] = useState(false)
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        setError(validate(formData));
    }, [formData]);

    // Are inputs filled?
    const isFormComplete = Object.values(formData).every((v) => v.trim() !== "");
    // Is form valid guided by validate function & isFormComplete?
    const isValid = isFormComplete && error === null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;
        const loggedIn = await signIn(formData.email, formData.password)
        if (loggedIn.status === "success") {
            console.log(loggedIn)
            navigate(`/${loggedIn.user.username}`, { replace: true });
        } else {
            setNotification({ type: "error", message: loggedIn.error });
        }
      };

      function validate({ email, password }) {
        if (email.length < 4) {
          return { field: "email", message: "Email must be at least 4 characters." };
        }
        if (!email.includes("@") || !email.includes(".")) {
            return { field: "email", message: "Email must be valid." };
        }
        if (password.length < 1) {
          return { field: "password", message: "Password must be at least 6 characters." };
        }
        return null;
      }

    return (
        <main className="w-dvw h-dvh flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-zinc-950 dark:text-gray-100 p-4 overflow-hidden">
            {/*  Notification */}
            { notification && (
                <Notification onClose={() => { setNotification(null) }} {...notification} />
            ) }
            <section className="max-w-72 md:max-w-md w-full flex flex-col items-center justify-center px-6 py-4 border border-gray-900/10 dark:border-white/10 rounded-md">
                <h2 className="font-display text-lg/7 font-semibold text-gray-900 dark:text-white">Sign In</h2>
                <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                    Register on MyBlog completing the form below
                </p>
                <form onSubmit={handleSubmit} className="w-full mt-4 flex flex-col gap-y-4">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Email</label>
                        <input name="email" id="email" type="email" placeholder="admin@alwexis.dev" onChange={handleChange} className="mt-2 block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 transition-all ease-in-out" />
                        {
                            error?.field === "email" && (
                                <div className="flex items-center gap-x-1 text-red-500 dark:text-red-400 text-sm/6 mt-1 animate-fade">
                                    <CircleAlert width={14} />
                                    <p>{error.message}</p>
                                </div>
                            )
                        }
                    </div>
                    {/* Password */}
                    <div className="pb-6 border-b border-gray-900/10 dark:border-white/10">
                        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Password</label>
                        <div className="flex items-center justify-between mt-2">
                            <input name="password" id="password" type={seePwd ? "text" : "password"} minLength={6} placeholder="******" onChange={handleChange} className="w-[90%] rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6 transition-all ease-in-out" />
                            <button type="button" className="cursor-pointer h-fit w-fit" onClick={() => { setSeePwd(!seePwd) }}>
                                { seePwd ? ( <EyeOff className="w-4 h-4" /> ) : ( <Eye className="w-4 h-4" /> ) }
                            </button>
                        </div>
                        {
                            error?.field === "password" && (
                                <div className="flex items-center gap-x-1 text-red-500 dark:text-red-400 text-sm/6 mt-1 animate-fade">
                                    <CircleAlert width={14} />
                                    <p>{error.message}</p>
                                </div>
                            )
                        }
                    </div>
                    {/* Submit */}
                    <button disabled={error} aria-disabled={error} title={error ? "Please fix form errors first" : undefined} type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:not-disabled:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer transition-all ease-in-out disabled:cursor-not-allowed disabled:opacity-60 font-display">
                        Sign In
                    </button>
                </form>
            </section>
            <p className="mt-6">You don't have an account? <a href="/sign-up" className="text-indigo-600 dark:text-indigo-400 font-bold">Sign Up</a></p>
        </main>
    );
}

//? TODO:
//* - Use the signin function from AuthContext to sign in the user and then redirect to the profile page
//* - Add a loading state to the button while the request is being made
//! - Remove deprecated or unused code!