import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import sampleUsers from "../../data/sampleUsers.json";
import usePagination from "../../components/common/usePagination";
import UserCardComponent from "../../components/UserCardComponent";
import type { UserProfile } from "../../context/useProfile";
import DashboardLayout from "../dashboard/Dashboard";

export default function ManageCustomers() {
    const [allCustomers] = useState<UserProfile[]>(sampleUsers);
    const [searchQuery, setSearchQuery] = useState("");

    const queryProfiles: UserProfile[] = useMemo(() => {
        if (!searchQuery.trim()) return allCustomers;
        return allCustomers.filter((customer) => {
            return (
                customer.email
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                customer.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    }, [searchQuery, allCustomers]);

    function editCustomer(id: number) {
        console.log("Editing: " + id);
    }
    function deleteCustomer(id: number) {
        console.log("Deleting: " + id);
    }

    const customerCards = useMemo(() => {
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
        currentItems: currentCustomers,
        goToNextPage,
        goToPrevPage,
        changePage,
    } = usePagination(customerCards, 8);

    return (
        <DashboardLayout
            title="Registered Customers"
            description="manage customers registered with our services"
            searchField={{
                placeHolder: "Name or Email",
                handleSearch: setSearchQuery,
            }}
            pagination={{
                currentPage,
                totalPages,
                currentItems: currentCustomers,
                goToNextPage,
                goToPrevPage,
                changePage,
            }}
        >
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentCustomers.length == 0 && (
                    <div className="col-span-4">
                        <h3 className="text-base text-slate-900 dark:text-slate-100 capitalize">
                            {searchQuery != ""
                                ? "0 Customers found with given search query"
                                : "No Customer registered with our service"}
                        </h3>
                    </div>
                )}
                {currentCustomers.map((cardData, idx) => (
                    <UserCardComponent key={idx} card={cardData} />
                ))}
            </div>
        </DashboardLayout>
    );
}
