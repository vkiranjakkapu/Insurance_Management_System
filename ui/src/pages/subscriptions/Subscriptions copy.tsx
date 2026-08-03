import {
    ClockIcon,
    ExclamationCircleIcon,
    ShieldCheckIcon,
    UserCircleIcon,
    UserPlusIcon,
} from "@heroicons/react/24/outline";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type SubmitEvent,
} from "react";
import CustomTableComponent from "../../components/CustomTableComponent";
import DashboardLayout from "../../components/DashboardLayout";
import type { FormErrorsProps } from "../../components/FormComponent";
import FormComponent from "../../components/FormComponent";
import ModalComponent from "../../components/ModalComponent";
import usePagination from "../../components/common/usePagination";
import PremiumsService, {
    PaymentStatus,
    SubscriptionStatus,
    type PolicySubscription,
} from "../../services/PremiumsService";

import {
    formatIsoDuration,
    isIsoDuration,
    isNumericString,
} from "../../utils/ResponseHandlingUtils";
import ActionButton from "../../components/ActionButton";
import type { UserProfile } from "../../context/useProfile";
import AccountService from "../../services/AccountService";
import { RoleType } from "../../context/usePrincipal";

const POLICY_TABLE_HEADERS: string[] = [
    "customerName",
    "policyId",
    "policyType",
    "agentEmail",
    // "policy",
    "startDate",
    // "endDate",
    // "expiry",
    // "payments",
    "status",
    // "acceptanceTime",
    // "updatedAt",
    // "createdA",
];

const POLICY_KEYS_MAP = POLICY_TABLE_HEADERS.reduce<Record<string, string>>(
    (acc, key) => {
        acc[key.toLowerCase()] = key;
        return acc;
    },
    {},
);

export default function Subscriptions() {
    const [allSubscriptions, setAllSubscriptions] = useState<
        PolicySubscription[]
    >([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [headers, setHeaders] = useState<string[]>([]);

    const [selectedSub, setSelectedSub] = useState<PolicySubscription>();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [dataFetchProgress, setDataFetchProgress] = useState(true);
    const [allAgents, setAllAgents] = useState<UserProfile[]>([]);

    const [formErrors, setFormErrors] = useState<FormErrorsProps | null>({
        type: "error",
        errors: [],
    });

    const refreshSubscriptions = useCallback(() => {
        PremiumsService.getAllSubscriptions<PolicySubscription[]>().then(
            (resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setAllSubscriptions(resp);
                    if (resp.length !== 0) {
                        setHeaders(POLICY_TABLE_HEADERS);
                    } else {
                        setHeaders(["No Subscriptions Available To Display"]);
                    }
                    setDataFetchProgress(false);
                }
            },
        );
    }, []);

    useEffect(() => {
        AccountService.getAllUsers<UserProfile[]>(RoleType.AGENT).then(
            (resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setAllAgents(resp);
                }
            },
        );
    }, []);

    useEffect(() => {
        refreshSubscriptions();
    }, [refreshSubscriptions]);

    const filteredSubscriptions = useMemo(() => {
        const query = searchQuery.trim();
        if (!query) return allSubscriptions;

        const sections = query.split(";");
        const searchCriteria: { key: string; values: string[] }[] = [];

        // Parse criteria
        for (const section of sections) {
            if (!section.includes(":")) continue;

            const [rawKey, rawValues] = section.split(":");
            const matchedRealKey = POLICY_KEYS_MAP[rawKey.trim().toLowerCase()];

            if (!matchedRealKey) continue;

            const values = rawValues
                .split(",")
                .map((v) => v.trim().toLowerCase())
                .filter(Boolean);

            if (values.length > 0) {
                searchCriteria.push({ key: matchedRealKey, values });
            }
        }

        if (searchCriteria.length === 0) return allSubscriptions;

        // Optimized structural loop
        return allSubscriptions.filter((claim) =>
            searchCriteria.every((criterion) => {
                const claimValue =
                    claim[criterion.key as keyof PolicySubscription];
                if (claimValue === undefined || claimValue === null)
                    return false;

                const normalizedClaimValue = String(claimValue).toLowerCase();
                return criterion.values.some((val) =>
                    normalizedClaimValue.includes(val),
                );
            }),
        );
    }, [searchQuery, allSubscriptions]);
    const pagination = usePagination<PolicySubscription>(
        filteredSubscriptions,
        10,
    );

    const renderCellValue = (value: unknown) => {
        if (
            value === SubscriptionStatus.ACTIVE ||
            value === PaymentStatus.PAID
        ) {
            return (
                <span className="capitalize inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <ShieldCheckIcon className="size-3.5 text-emerald-500" />
                    {SubscriptionStatus.ACTIVE}
                </span>
            );
        }
        if (
            value === SubscriptionStatus.PENDING ||
            value === PaymentStatus.PENDING
        ) {
            return (
                <span className="capitalize inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                    <ClockIcon className="size-3.5 text-amber-500" />
                    {SubscriptionStatus.PENDING}
                </span>
            );
        }
        if (
            value === SubscriptionStatus.EXPIRED ||
            value === PaymentStatus.OVERDUE
        ) {
            return (
                <span className="capitalize inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-700 dark:text-rose-400">
                    <ExclamationCircleIcon className="size-3.5 text-rose-500" />
                    {SubscriptionStatus.EXPIRED}
                </span>
            );
        }

        if (isNumericString(String(value))) {
            return "₹ " + value + " /-";
        }

        if (isIsoDuration(value)) {
            return formatIsoDuration(value);
        }

        return String(value ?? "");
    };

    const handleAssignSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        
    };

    return (
        <DashboardLayout
            title="Subscription"
            description="Policy Subscription will be shown in here"
        >
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Policy"
                maxWidthClass="max-w-6xl"
            >
                <FormComponent
                    handleSubmit={handleAssignSubmit}
                    formErrors={formErrors}
                    actionText="Assign"
                    icon={UserCircleIcon}
                    closeModal={() => setIsModalOpen(false)}
                >
                    <div className="col-span-full">
                        <DashboardLayout title="Assign to Agent">
                            <div className="flex flex-col md:flex-row gap-2 justify-between items-start md:items-center">
                                <div className="w-10/12">
                                    <div className="inline-flex items-center w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-1.5 ">
                                        <select
                                            name="policyType"
                                            className="w-full capitalize shadow-smtext-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            defaultValue={""}
                                            required
                                        >
                                            <option value="" disabled>
                                                Select Agent
                                            </option>
                                            {allAgents.map((agent, idx) => {
                                                return (
                                                    <option key={idx}>
                                                        {agent.email}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <ActionButton
                                        onClick={() => {}}
                                        type="submit"
                                        text="Assign"
                                        icon={UserPlusIcon}
                                        className="outline outline-indigo-600 outline-offset-1 rounded-lg"
                                    />
                                </div>
                            </div>
                        </DashboardLayout>
                    </div>
                    <div className="col-span-full rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-800 p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="col-span-full">
                            <span className="text-slate-800 dark:text-slate-200">
                                Customer details
                            </span>
                        </div>
                        <div>{selectedSub?.customer.firstName}</div>
                        <div>{selectedSub?.customer.lastName}</div>
                        <div>{selectedSub?.customer.email}</div>
                        <div>{selectedSub?.customer.phone}</div>
                    </div>
                    <div className="col-span-full rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-800 p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="col-span-full">
                            <span className="text-slate-800 dark:text-slate-200">
                                Agent details
                            </span>
                        </div>
                        <div>{selectedSub?.agent.firstName}</div>
                        <div>{selectedSub?.agent.lastName}</div>
                        <div>{selectedSub?.agent.email}</div>
                        <div>{selectedSub?.agent.phone}</div>
                    </div>
                    <div className="col-span-full rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-800 p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="col-span-full">
                            <span className="text-slate-800 dark:text-slate-200">
                                Policy details
                            </span>
                        </div>
                        <div className="">{selectedSub?.policy.policyId}</div>
                        <div className=" col-span-2">
                            {selectedSub?.policy.description}
                        </div>
                        <div className="">{selectedSub?.policy.policyType}</div>
                        <div className="">{selectedSub?.policy.status}</div>
                        <div className="">
                            {selectedSub?.policy.coverageAmount}
                        </div>
                        <div className="">
                            {selectedSub?.policy.coverageDuration}
                        </div>
                        <div className="">
                            {selectedSub?.policy.premiumsDuration}
                        </div>
                    </div>
                    <div className="col-span-full">
                        <div className="col-span-full">
                            <CustomTableComponent
                                title="Premiums"
                                headers={[
                                    "id",
                                    "premiumAmount",
                                    "status",
                                    "dueDate",
                                    // "createdA",
                                ]}
                                body={selectedSub?.payments ?? []}
                                renderCellValue={renderCellValue}
                            />
                        </div>
                    </div>
                </FormComponent>
            </ModalComponent>
            <CustomTableComponent
                dataFetchProgress={dataFetchProgress}
                headers={headers}
                pagination={pagination}
                body={filteredSubscriptions}
                onActionClick={(val) => {
                    setSelectedSub(val);
                    setIsModalOpen(true);
                }}
                renderCellValue={renderCellValue}
                searchField={{
                    handleSearch: setSearchQuery,
                    matchInfo: searchQuery.trim()
                        ? `Matches: ${filteredSubscriptions.length}`
                        : "",
                }}
            />
        </DashboardLayout>
    );
}
