export default function DeletePost({ onClose }) {
    return (
        <section className="fixed bg-black/75 h-dvh w-dvw flex items-center justify-center z-50 animate-fade animate-duration-[200ms]">
            <div className="max-w-72 md:max-w-xs w-full flex flex-col items-center justify-center px-6 py-4 bg-neutral-100 dark:bg-gray-900 border border-gray-900/10 dark:border-white/10 rounded-md shadow-md">
                <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-gray-100">Are you sure?</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
                <div className="flex justify-between mt-4 font-display w-full">
                    <button onClick={() => { onClose(false) }} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-sm cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">Cancel</button>
                    <button onClick={() => { onClose(true) }} className="px-4 py-2 bg-red-600 text-white rounded-sm cursor-pointer hover:bg-red-500 transition-all">Delete</button>
                </div>
            </div>
        </section>
    )
}