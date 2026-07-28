import {
    DocumentPlusIcon,
    PlusIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../routes/RoutePaths";
import { type Policy } from "./Policy";

import { useMemo, useState } from "react";
import samplePolicies from "../../data/samplePolicies.json";
import ActionButton from "../../components/ActionButton";
import usePagination from "../../components/common/usePagination";
import CustomTableComponent from "../../components/CustomTableComponent";
import LoadingPortalComponent from "../../components/LoadingPortalComponent";
import ModalComponent from "../../components/ModalComponent";

const CLAIM_KEYS_MAP = samplePolicies[0]
    ? Object.keys(samplePolicies[0]).reduce<Record<string, string>>(
          (acc, key) => {
              acc[key.toLowerCase()] = key;
              return acc;
          },
          {},
      )
    : {};

export default function ManagePolicies() {
    const navigate = useNavigate();

    const [allPolicies] = useState<Policy[]>(samplePolicies as Policy[]);
    const [searchQuery, setSearchQuery] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(true);

    const filteredPolicies = useMemo(() => {
        const query = searchQuery.trim();
        if (!query) return allPolicies;

        const sections = query.split(";");
        const searchCriteria: { key: string; values: string[] }[] = [];

        // Parse criteria
        for (const section of sections) {
            if (!section.includes(":")) continue;

            const [rawKey, rawValues] = section.split(":");
            const matchedRealKey = CLAIM_KEYS_MAP[rawKey.trim().toLowerCase()];

            if (!matchedRealKey) continue;

            const values = rawValues
                .split(",")
                .map((v) => v.trim().toLowerCase())
                .filter(Boolean);

            if (values.length > 0) {
                searchCriteria.push({ key: matchedRealKey, values });
            }
        }

        if (searchCriteria.length === 0) return allPolicies;

        // Optimized structural loop
        return allPolicies.filter((claim) =>
            searchCriteria.every((criterion) => {
                const claimValue = claim[criterion.key as keyof Policy];
                if (claimValue === undefined || claimValue === null)
                    return false;

                const normalizedClaimValue = String(claimValue).toLowerCase();
                return criterion.values.some((val) =>
                    normalizedClaimValue.includes(val),
                );
            }),
        );
    }, [searchQuery, allPolicies]);

    const pagination = usePagination<Policy>(filteredPolicies, 10);

    function fetchPolicy(claim: Policy) {
        navigate(`${RoutePaths.POLICIES}/${claim.id}`);
    }

    // Safely check for headers fallback
    const headers = allPolicies[0] ? Object.keys(allPolicies[0]) : [];

    function addPolicy(policyData: FormData) {
        console.log(policyData.get("premium"));

        // setIsModalOpen(false); // Close on execution success
    }

    return (
        <>
            <LoadingPortalComponent
                isLoading={false}
                message="Loading Policies"
                subMessage="please wait"
            />
            {/* Reusable Form Modal Wrapper */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Policy"
                maxWidthClass="max-w-4xl"
            >
                <form
                    action={addPolicy}
                    className="space-y-4 px-2 grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Claim Amount ($)
                        </label>
                        <input
                            name="premium"
                            type="number"
                            required
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Incident Notes
                        </label>
                        <textarea
                            rows={3}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Bottom Action Drawer buttons */}
                    <div className="col-span-full flex items-center justify-end space-x-3 pt-4 mt-6 border-t border-slate-200 dark:border-slate-800">
                        <ActionButton
                            text="Cancel"
                            onClick={() => setIsModalOpen(false)}
                            icon={XMarkIcon}
                            unsetClass={true}
                            className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        />
                        <ActionButton
                            text="Submit Policy"
                            onClick={() => {}}
                            icon={DocumentPlusIcon}
                            className="rounded-lg"
                        />
                    </div>
                </form>
            </ModalComponent>
            <CustomTableComponent
                title="Our Policies"
                description="Manage recent enrollments and active coverage."
                actionButtons={[
                    {
                        text: "New Policy",
                        icon: PlusIcon,
                        onClick: () => {
                            setIsModalOpen(!isModalOpen);
                        },
                    },
                ]}
                headers={headers}
                pagination={pagination}
                body={filteredPolicies}
                onActionClick={fetchPolicy}
                searchField={{ handleSearch: setSearchQuery }}
            />
        </>
    );
}
