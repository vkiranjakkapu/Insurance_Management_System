import {
    PencilIcon,
    TrashIcon,
    UserPlusIcon,
} from "@heroicons/react/24/outline";
import UserCard from "../../components/UserCard";
import type { UserCardData } from "../../components/common/Components";

import type { UserProfile } from "../../context/useProfile";
import sampleList from "../../../public/sampleUsers.json";

export default function ManageEmployees() {
    function editCustomer(id: number) {
        console.log("Editing: " + id);
    }
    function deleteCustomer(id: number) {
        console.log("Deleting: " + id);
    }

    const userCards: UserCardData[] = [];

    const usersList = sampleList as UserProfile[];
    usersList.map((user) => {
        userCards.push({
            id: user.id,
            dp: "src/assets/undraw_deep-thinker-avatar_6xg6.svg",
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone,
            actionButtons: [
                {
                    text: "",
                    icon: PencilIcon,
                    action: editCustomer,
                },
                {
                    text: "",
                    icon: TrashIcon,
                    action: deleteCustomer,
                },
            ],
        });
    });

    return (
        <>
            <div className="flex justify-between w-full">
                <h1 className="text-indigo-600 dark:text-white">
                    Manage Employees
                </h1>
                <button className="inline-flex outline-1 outline-indigo-500 outline-offset-1 rounded">
                    <button className="flex gap-2 px-2 py-1 rounded cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white">
                        <UserPlusIcon className="h-4 w-4 my-auto" />
                        <span className="">Add</span>
                    </button>
                </button>
            </div>
            <hr className="my-3" />
            <div className="container grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {userCards.map((cardData, idx) => (
                    <UserCard key={idx} card={cardData} />
                ))}
            </div>
        </>
    );
}
