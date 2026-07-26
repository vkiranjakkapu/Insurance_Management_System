import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Avatar from "../../assets/undraw_deep-thinker-avatar_6xg6.svg";

export default function CustomerCard() {
    return (
        <div className="text-center">
            <div className="flex flex-col gap-3 p-3 bg-gray-200/50 dark:bg-gray-800/70 rounded border border-gray-200/90 dark:border-gray-600 hover:drop-shadow-xs dark:hover:drop-shadow-gray-700/20">
                <ul className="text-center flex flex-col gap-1">
                    <li>
                        <img
                            src={Avatar}
                            alt="Customer Avatar"
                            width="100px"
                            className="mx-auto my-2 bg-gray-50 rounded-full outline-1 outline-gray-300 outline-offset-2"
                        />
                    </li>
                    <li className="flex flex-col text-center">
                        Venkata Kiran J
                    </li>
                    <li className="text-sm">venkatakiran.jakkapu@gmail.com</li>
                    <li>9493660145</li>
                </ul>
                <div
                    className="inline-flex mx-auto my-1 rounded-lg shadow-sm outline-1 outline-offset-2 outline-indigo-500"
                    role="group"
                >
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-indigo-900 dark:text-white bg-indigo-200/80 hover:bg-indigo-400/80 dark:bg-indigo-600/40 dark:border-indigo-300/50 rounded-s-lg dark:hover:bg-indigo-900/50 focus:z-10 focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>

                    {/* <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-indigo-900 dark:text-white bg-indigo-200/80 hover:bg-indigo-400/80 dark:bg-indigo-600/40 dark:border-indigo-300/50 dark:hover:bg-indigo-900/50 focus:z-10 focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
        >
            Active
        </button> */}

                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-indigo-900 dark:text-white bg-indigo-200/80 hover:bg-indigo-400/80 dark:bg-indigo-600/40 dark:border-indigo-300/50 rounded-e-lg dark:hover:bg-indigo-900/50 focus:z-10 focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
                    >
                        <TrashIcon className="h-3 w-3" />
                    </button>
                </div>
            </div>
        </div>
    );
}
