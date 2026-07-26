import { UserPlusIcon } from "@heroicons/react/24/outline";
import CustomerCard from "./CustomerCard";

export default function ManageCustomers() {
    return (
        <>
            <div className="flex justify-between w-full">
                <h1 className="text-indigo-600">Manage Customers</h1>
                <button className="flex gap-2 px-2 py-1 rounded cursor-pointer bg-indigo-600 dark:bg-indigo-800/10 text-white">
                    <UserPlusIcon className="h-4 w-4 my-auto" />
                    <span className="">Add</span>
                </button>
            </div>
            <hr className="my-3" />
            <div className="container grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <CustomerCard />
                <CustomerCard />
                <CustomerCard />
                <CustomerCard />
                <CustomerCard />
                <CustomerCard />
            </div>
        </>
    );
}
