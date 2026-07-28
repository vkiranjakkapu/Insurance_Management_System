import {
    PencilIcon,
    TrashIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import sampleUsers from "../../data/sampleUsers.json";
import usePagination from "../../components/common/usePagination";
import LoadingPortalComponent from "../../components/LoadingPortalComponent";
import UserCardComponent from "../../components/UserCardComponent";
import type { UserProfile } from "../../context/useProfile";
import DashboardLayout from "../dashboard/Dashboard";

export default function ManageEmployees() {
    const [allEmployees] = useState<UserProfile[]>(sampleUsers);
    const [searchQuery, setSearchQuery] = useState("");

    const queryProfiles: UserProfile[] = useMemo(() => {
        if (!searchQuery.trim()) return allEmployees;
        return allEmployees.filter((user) => {
            return (
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    }, [searchQuery, allEmployees]);

    function editCustomer(id: number) {
        console.log("Editing: " + id);
    }
    function deleteCustomer(id: number) {
        console.log("Deleting: " + id);
    }

    const employeeCards = useMemo(() => {
        return queryProfiles.map((customer) => ({
            id: customer.id,
            dp: "src/assets/undraw_deep-thinker-avatar_6xg6.svg",
            name: `${customer.firstName} ${customer.lastName}`,
            email: customer.email,
            phone: customer.phone,
            actionButtons: [
                { text: "", icon: PencilIcon, onClick: editCustomer },
                { text: "", icon: TrashIcon, onClick: deleteCustomer },
            ],
        }));
    }, [queryProfiles]);

    const {
        currentPage,
        totalPages,
        currentItems: currentEmployees,
        goToNextPage,
        goToPrevPage,
        changePage,
    } = usePagination(employeeCards, 8);

    const matchInfo = useMemo(() => {
        return "Matches: " + queryProfiles.length;
    }, [queryProfiles]);

    return (
        <DashboardLayout
            title="Our Agents"
            description="manage agents registered with us"
            searchField={{
                placeHolder: "Name or Email",
                handleSearch: setSearchQuery,
                matchInfo,
            }}
            pagination={{
                currentPage,
                totalPages,
                currentItems: currentEmployees,
                goToNextPage,
                goToPrevPage,
                changePage,
            }}
        >
            <LoadingPortalComponent
                isLoading={false}
                icon={UserGroupIcon}
                message="Fetching Employees"
                subMessage="please wait"
            />
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentEmployees.length == 0 && (
                    <div className="col-span-4">
                        <h3 className="text-base text-slate-900 dark:text-slate-100 capitalize">
                            {searchQuery != ""
                                ? "No Employees found with given search query"
                                : "No Employee Registered with us"}
                        </h3>
                    </div>
                )}
                {currentEmployees.map((cardData, idx) => (
                    <UserCardComponent key={idx} card={cardData} />
                ))}
            </div>
        </DashboardLayout>
    );
}
