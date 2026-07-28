import { PlusIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../routes/RoutePaths";
import { type Policy } from "./Policy";

import { useMemo, useState } from "react";
import samplePolicies from "../../../public/samplePolicies.json";
import type { ActionButtonProps } from "../../components/ActionButton";
import CustomTableComponent from "../../components/CustomTable";
import { LoadingPortal } from "../../components/LoadingPortal";
import usePagination from "../../components/common/usePagination";

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

    const addPolicyButton: ActionButtonProps = {
        text: "New Policy",
        icon: PlusIcon,
        onClick: () => {
            console.log("Action Button");
        },
    };

    return (
        <>
            <LoadingPortal
                isLoading={false}
                message="Loading Policies"
                subMessage="please wait"
            />
            <CustomTableComponent
                title="Our Policies"
                description="Manage recent enrollments and active coverage."
                actionButtons={[addPolicyButton]}
                headers={headers}
                pagination={pagination}
                body={filteredPolicies}
                onActionClick={fetchPolicy}
                searchField={{ handleSearch: setSearchQuery }}
            />
        </>
    );
}
