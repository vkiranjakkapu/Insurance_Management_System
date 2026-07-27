import { useNavigate } from "react-router-dom";
import sampleClaims from "../../../public/sampleClaims.json";

import { useState } from "react";
import type {
    CustomTable,
    CustomTableData,
} from "../../components/common/Components";
import { LoadingPortal } from "../../components/common/LoadingPortal";
import CustomTableComponent from "../../components/CustomTable";
import { RoutePaths } from "../../routes/RoutePaths";
import type { PolicyClaim } from "./PolicyClaims";

export default function ManageClaims() {
    const [allClaims] = useState<PolicyClaim[]>(sampleClaims as PolicyClaim[]);

    const [queryClaims, setQueryClaims] = useState<PolicyClaim[]>(
        sampleClaims as PolicyClaim[],
    );

    const navigate = useNavigate();

    function handleSearch(query: string) {
        if (!query.trim()) {
            setQueryClaims(allClaims);
            return;
        }

        // Get a reference sample object to extract the real, correctly-cased keys
        // Fallback to empty object if array is empty to prevent crashes
        const sampleObject = sampleClaims[0] || {};
        const realKeys = Object.keys(sampleObject);

        const sections = query.split(";");
        const searchCriteria: { key: string; values: string[] }[] = [];

        sections.forEach((sc) => {
            if (!sc.includes(":")) return;

            const [rawKey, rawValues] = sc.split(":");
            const userInputKey = rawKey.trim().toLowerCase(); // Lowercase the user's typed key

            // Dynamic key matching: Find the actual key that matches the lowercase user input
            const matchedRealKey = realKeys.find(
                (realKey) => realKey.toLowerCase() === userInputKey,
            );

            // If the key doesn't exist on our object at all, skip this criteria block
            if (!matchedRealKey) return;

            const values = rawValues
                .split(",")
                .map((v) => v.trim().toLowerCase())
                .filter(Boolean);

            if (values.length > 0) {
                searchCriteria.push({ key: matchedRealKey, values });
            }
        });

        // If no valid criteria could be parsed from the user input, return original list or empty
        if (searchCriteria.length === 0) {
            setQueryClaims(allClaims);
            return;
        }

        // 2. Filter using the verified, correctly-cased real keys
        const filteredClaims = sampleClaims.filter((claim) => {
            return searchCriteria.every((criterion) => {
                const claimValue = claim[criterion.key as keyof typeof claim];

                if (claimValue === undefined) return false;

                const normalizedClaimValue = String(claimValue).toLowerCase();

                return criterion.values.some((val) =>
                    normalizedClaimValue.includes(val),
                );
            });
        });

        console.log("Filtered Results:", filteredClaims);
        setQueryClaims(filteredClaims as PolicyClaim[]);
    }

    const claimsData: CustomTableData<PolicyClaim> = {
        headers: Object.keys(allClaims[0]),
        pagination: true,
        perPage: 10,
        body: queryClaims,
    };

    const claimsTable: CustomTable<PolicyClaim> = {
        title: "Policy Claims",
        description: "Manage claims raised by customers",
        actionButtons: [],
        tableData: claimsData,
    };

    function fetchClaimDetails(claim: PolicyClaim) {
        navigate(`${RoutePaths.CLAIMS}/${claim.id}`);
    }

    return (
        <>
            <LoadingPortal
                isLoading={false}
                message="Loading Policies"
                subMessage="please wait"
            />
            <CustomTableComponent
                table={claimsTable}
                handleSearch={handleSearch}
                onActionClick={fetchClaimDetails}
            ></CustomTableComponent>
        </>
    );
}
