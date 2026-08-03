import {
    ClockIcon,
    ExclamationCircleIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePagination from "../../components/common/usePagination";
import CustomTableComponent from "../../components/CustomTableComponent";
import sampleClaims from "../../data/sampleClaims.json";
import { RoutePaths } from "../../routes/RoutePaths";
import ClaimsService, {
    ClaimStatus,
    type PolicyClaim,
} from "../../services/ClaimsService";

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

    const [allClaims, setAllClaims] = useState<PolicyClaim[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [dataFetchProgress, setDataFetchProgress] = useState(true);
    const [headers, setHeaders] = useState<string[]>([]);

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

    const refreshClaims = useCallback(() => {
        ClaimsService.getAllCalims<PolicyClaim[]>().then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setHeaders([
                    // "id",
                    "claimId",
                    // "subscription",
                    // "customerId",
                    "customerName",
                    "customerEmail",
                    // "agentId",
                    "agentName",
                    "agentEmail",
                    "reason",
                    // "proofs",
                    "status",
                    // "resolverId",
                    // "resolverName",
                    // "updatedAt",
                    // "createdAt",
                ]);
                setAllClaims(
                    resp.map((claim) => {
                        return {
                            ...claim,
                            customerName:
                                claim.subscription.customer.firstName +
                                " " +
                                claim.subscription.customer.lastName,
                            customerEmail: claim.subscription.customer.email,
                            agentName:
                                claim.agent != null
                                    ? claim.agent?.firstName +
                                      " " +
                                      claim.agent?.lastName
                                    : "Not Assigned",
                            agentEmail:
                                claim.agent != null ? claim.agent?.email : "NA",
                        };
                    }),
                );
            } else {
                setHeaders(["No claims Available"]);
            }
            setDataFetchProgress(false);
        });
    }, []);

    useEffect(() => {
        refreshClaims();
    }, [refreshClaims]);

    const renderCellValue = (value: unknown) => {
        if (value == ClaimStatus.APPROVED) {
            return (
                <span className="capitalize inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <ShieldCheckIcon className="size-3.5 text-emerald-500" />
                    {ClaimStatus.APPROVED}
                </span>
            );
        }
        if (value === ClaimStatus.INITIATED) {
            return (
                <span className="capitalize inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-700 dark:text-cyan-400">
                    <ClockIcon className="size-3.5 text-cyan-500" />
                    {ClaimStatus.PENDING}
                </span>
            );
        }
        if (value === ClaimStatus.PENDING || value === ClaimStatus.ASSIGNED) {
            return (
                <span className="capitalize inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                    <ClockIcon className="size-3.5 text-amber-500" />
                    {ClaimStatus.PENDING}
                </span>
            );
        }
        if (value === ClaimStatus.REJECTED) {
            return (
                <span className="capitalize inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-700 dark:text-rose-400">
                    <ExclamationCircleIcon className="size-3.5 text-rose-500" />
                    {ClaimStatus.REJECTED}
                </span>
            );
        }

        return String(value ?? "");
    };

    const pagination = usePagination<PolicyClaim>(filteredClaims, 10);

    return (
        <>
            <CustomTableComponent
                title="Claims"
                description="Manage claims raised by customers"
                headers={headers}
                pagination={pagination}
                body={filteredClaims}
                onActionClick={(claim) => {
                    navigate(`${RoutePaths.CLAIMS}/${claim.claimId}`);
                }}
                renderCellValue={renderCellValue}
                dataFetchProgress={dataFetchProgress}
                actionButtons={
                    [
                        // {
                        //     text: "New Claim",
                        //     icon: PlusIcon,
                        //     onClick: () => {},
                        // },
                    ]
                }
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
