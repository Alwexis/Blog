import { X } from "lucide-react"
import { useEffect } from "react";

export default function Notification({ type, message, onClose }) {
    useEffect(() => {
        const timeOut = setTimeout(onClose, 5 * 1000);

        return () => {
            clearTimeout(timeOut);
        };
    }, []);

    let bgColor;
    if (type === "success") {
        bgColor = "bg-green-400";
    } else if (type === "error") {
        bgColor = "bg-red-400";
    } else if (type === "warning") {
        bgColor = "bg-yellow-400";
    }

    return (
        <div className="fixed -bottom-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className={`flex items-center w-full max-w-sm px-2.5 py-2 rounded-sm shadow-md animate-fade-up ${bgColor}`} role="alert">
                <X onClick={onClose} className="cursor-pointer border-r mr-2 pr-1" />
                <span>{message}</span>
            </div>
        </div>
    )
}