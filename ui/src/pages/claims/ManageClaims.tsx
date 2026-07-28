import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import sampleClaims from "../../../public/sampleClaims.json";
import usePagination from "../../components/common/usePagination";
import type { PolicyClaim } from "./PolicyClaims";
import CustomTableComponent from "../../components/CustomTable";
import { RoutePaths } from "../../routes/RoutePaths";
import { LoadingPortal } from "../../components/LoadingPortal";

const CLAIM_KEYS_MAP = sampleClaims[0]
    ? Object.keys(sampleClaims[0]).reduce<Record<string, string>>(
          (acc, key) => {
              acc[key.toLowerCase()] = key;
              return acc;
          },
          {},
      )
    : {};

export default function ManageClaims() {
    const navigate = useNavigate();

    const [allClaims] = useState<PolicyClaim[]>(sampleClaims as PolicyClaim[]);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredClaims = useMemo(() => {
        const query = searchQuery.trim();
        if (!query) return allClaims;

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

        if (searchCriteria.length === 0) return allClaims;

        // Optimized structural loop
        return allClaims.filter((claim) =>
            searchCriteria.every((criterion) => {
                const claimValue = claim[criterion.key as keyof PolicyClaim];
                if (claimValue === undefined || claimValue === null)
                    return false;

                const normalizedClaimValue = String(claimValue).toLowerCase();
                return criterion.values.some((val) =>
                    normalizedClaimValue.includes(val),
                );
            }),
        );
    }, [searchQuery, allClaims]);

    const pagination = usePagination<PolicyClaim>(filteredClaims, 10);

    function fetchClaimDetails(claim: PolicyClaim) {
        navigate(`${RoutePaths.CLAIMS}/${claim.id}`);
    }

    // Safely check for headers fallback
    const headers = allClaims[0] ? Object.keys(allClaims[0]) : [];

    return (
        <>
            <LoadingPortal
                isLoading={false}
                message="Loading Policies"
                subMessage="please wait"
            />
            <CustomTableComponent
                title="Policy Claims"
                description="Manage claims raised by customers"
                headers={headers}
                pagination={pagination}
                body={filteredClaims} // Pass memoized result here
                onActionClick={fetchClaimDetails}
                searchField={{
                    handleSearch: setSearchQuery,
                    matchInfo: searchQuery.trim()
                        ? `Matches: ${filteredClaims.length}`
                        : "",
                }}
            />
        </>
    );
}
