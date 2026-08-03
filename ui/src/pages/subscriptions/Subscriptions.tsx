import {
    CalendarIcon,
    ClockIcon,
    ExclamationCircleIcon,
    PlusIcon,
    ShieldCheckIcon,
    UserCircleIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import CustomTableComponent from "../../components/CustomTableComponent";
import usePagination from "../../components/common/usePagination";
import PremiumsService, {
    PaymentStatus,
    SubscriptionStatus,
    type PolicySubscription,
} from "../../services/PremiumsService";

import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../routes/RoutePaths";
import {
    formatIsoDuration,
    isIsoDuration,
    isNumericString,
} from "../../utils/ResponseHandlingUtils";
import ModalComponent from "../../components/ModalComponent";
import FormComponent, {
    type FormErrorsProps,
} from "../../components/FormComponent";
import type { Policy } from "../policies/Policy";
import PolicyService from "../../services/PolicyService";
import type { UserProfile } from "../../context/useProfile";
import AccountService from "../../services/AccountService";
import usePrincipal, { RoleType } from "../../context/usePrincipal";
import type { ActionButtonProps } from "../../components/ActionButton";

const POLICY_TABLE_HEADERS: string[] = [
    "policyId",
    "policyType",
    // "description",
    "coverageAmount",
    "coverageDuration",
    "premiumsDuration",
    "status",
];

const POLICY_KEYS_MAP = POLICY_TABLE_HEADERS.reduce<Record<string, string>>(
    (acc, key) => {
        acc[key.toLowerCase()] = key;
        return acc;
    },
    {},
);

export default function Subscriptions() {
    const { isCustomer } = usePrincipal();
    const navigate = useNavigate();
    const [allSubscriptions, setAllSubscriptions] = useState<
        PolicySubscription[]
    >([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [headers, setHeaders] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrorsProps | null>({
        type: "error",
        errors: [],
    });

    const [allCustomers, setAllCustomers] = useState<UserProfile[]>([]);
    const [allPolicies, setAllPolicies] = useState<Policy[]>([]);
    const [policySearchQuery, setPolicySearchQuery] = useState<string>("");
    const [secondsLeft, setSecondsLeft] = useState<number>(0);
    const [selectedPolicies, setSelectedPolicies] = useState<Policy[]>([]);
    const [dataFetchProgress, setDataFetchProgress] = useState(true);

    const refreshSubscriptions = useCallback(() => {
        PremiumsService.getAllSubscriptions<PolicySubscription[]>().then(
            (resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setAllSubscriptions(
                        resp.map((sub) => ({
                            ...sub,
                            customerName: sub.customer.firstName,
                            coverageAmount: sub.policy.coverageAmount,
                            coverageDuration: sub.policy.coverageDuration,
                            premiumsDuration: sub.policy.premiumsDuration,
                        })),
                    );
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

    const refreshPolices = useCallback(() => {
        PolicyService.getAllPolicies<Policy[]>().then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setAllPolicies(resp);
            }
            setDataFetchProgress(false);
        });
    }, []);

    const refreshCustomers = useCallback(() => {
        AccountService.getAllUsers<UserProfile[]>(RoleType.CUSTOMER).then(
            (resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setAllCustomers(resp);
                }
            },
        );
    }, []);

    useEffect(() => {
        refreshSubscriptions();
        if (!isCustomer()) {
            refreshPolices();
            refreshCustomers();
        }
    }, [
        refreshSubscriptions,
        refreshPolices,
        refreshCustomers,
        isCustomer,
        dataFetchProgress,
    ]);

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
    const filteredPolicies = useMemo(() => {
        const query = policySearchQuery.trim();
        if (!query) return allPolicies;

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
    }, [policySearchQuery, allPolicies]);

    const makeSubscription = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const subcriptionData = new FormData(e.currentTarget);

        createSubscription(
            subcriptionData.get("customerId"),
            selectedPolicies.map((p) => p.id),
            subcriptionData.get("premiumAmount"),
            subcriptionData.get("startDate"),
        );
    };

    const createSubscription = (
        customerId: unknown,
        policyIds: number[],
        premiumAmount: unknown,
        startDate: unknown,
    ) => {
        const payload = {
            customerId,
            policyIds,
            premiumAmount,
            startDate,
        };
        PremiumsService.createSubscription<PolicySubscription>(payload).then(
            (resp) => {
                if (resp && "errorMessage" in resp) {
                    setFormErrors({
                        type: "error",
                        errors:
                            resp.validationErrors != null &&
                            resp.validationErrors.length > 0
                                ? [
                                      ...resp.validationErrors.map(
                                          (er) => er.field + ": " + er.message,
                                      ),
                                  ]
                                : [resp.errorMessage],
                    });
                } else {
                    setFormErrors({
                        type: "success",
                        errors: ["Customer Subscribed To Policy Successfully."],
                    });
                    setSecondsLeft(5);
                    refreshSubscriptions();
                    const intervalId = setInterval(() => {
                        setSecondsLeft((prev) => {
                            if (prev <= 1) {
                                clearInterval(intervalId);
                                setIsModalOpen(false);
                                setFormErrors(null);
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);

                    return () => clearInterval(intervalId);
                }
            },
        );
    };

    const handlePolicyCheckbox = (
        e: ChangeEvent<HTMLInputElement>,
        policy: Policy,
    ) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setSelectedPolicies((prev) => [...prev, policy]);
        } else {
            setSelectedPolicies((prev) =>
                prev.filter((pol) => pol.id !== policy.id),
            );
        }
    };

    const policiesPagination = usePagination<Policy>(filteredPolicies, 10);

    const subsPagination = usePagination<PolicySubscription>(
        filteredSubscriptions,
        10,
    );

    const actionButtons: ActionButtonProps[] = !isCustomer()
        ? [
              {
                  text: "New Subscription",
                  icon: PlusIcon,
                  onClick: () => {
                      setIsModalOpen(true);
                  },
              },
          ]
        : [];

    return (
        <>
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Policy"
                maxWidthClass="max-w-6xl"
            >
                <FormComponent
                    handleSubmit={makeSubscription}
                    formErrors={formErrors}
                    actionText="Assign"
                    icon={UserCircleIcon}
                    secondsLeft={secondsLeft}
                    closeModal={() => setIsModalOpen(false)}
                    showFooter
                >
                    <>
                        <div className="">
                            Select Customer
                            <div className="w-full inline-flex gap-2 items-center rounded-lg border border-slate-200 dark:border-slate-800 ps-3 pe-1.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <label className="text-slate-700 dark:text-slate-300">
                                    <UserIcon className="size-4" />
                                </label>
                                <select
                                    name="customerId"
                                    className="w-full py-0.5 capitalize shadow-smtext-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    defaultValue={""}
                                    required
                                >
                                    <option value="" disabled>
                                        Customer
                                    </option>
                                    {allCustomers.map((cust, idx) => {
                                        return (
                                            <option key={idx} value={cust.id}>
                                                {cust.email}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="">
                            Policy Satrt Date:
                            <div className="w-full inline-flex gap-2 items-center rounded-lg border border-slate-200 dark:border-slate-800 ps-3 pe-1.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <label className="text-slate-700 dark:text-slate-300">
                                    <CalendarIcon className="size-4" />
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    className="w-full py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="">
                            Premium Amount:
                            <div className="w-full inline-flex gap-2 items-center rounded-lg border border-slate-200 dark:border-slate-800 ps-3 pe-1.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <label className="text-slate-700 dark:text-slate-300">
                                    <span className="size-4">₹</span>
                                </label>
                                <input
                                    type="number"
                                    onWheel={(e) =>
                                        (e.target as HTMLInputElement).blur()
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            [
                                                "e",
                                                "E",
                                                "-",
                                                "+",
                                                ".",
                                                ",",
                                            ].includes(e.key)
                                        )
                                            e.preventDefault();
                                    }}
                                    min={0}
                                    name="premiumAmount"
                                    pattern="\d*"
                                    placeholder="premium amount"
                                    className="py-0.5 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-span-full bg-slate-100 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                            Selected Policies:
                            <div
                                className={`w-full mt-1 inline-flex gap-2 py-2 overflow-x-scroll items-center rounded-lg text-sm text-slate-900 dark:text-slate-100`}
                            >
                                <label className="text-slate-600 dark:text-slate-300 grid grid-cols-3 md:grid-cols-6 gap-2">
                                    {selectedPolicies.length != 0 ? (
                                        selectedPolicies.map((pol) => {
                                            return (
                                                <span className="py-0.5 px-1 border text-sm drop-shadow rounded-lg border-slate-200 dark:border-slate-800">
                                                    {pol.policyId}
                                                </span>
                                            );
                                        })
                                    ) : (
                                        <span className="text-rose-500 dark:text-rose-400 w-100">
                                            Please Select Atleast One Policy
                                        </span>
                                    )}
                                </label>
                            </div>
                        </div>
                        <div className="md:col-span-full">
                            <CustomTableComponent
                                title="Select Policy"
                                dataFetchProgress={dataFetchProgress}
                                headers={POLICY_TABLE_HEADERS}
                                pagination={policiesPagination}
                                body={filteredPolicies}
                                renderCellValue={renderCellValue}
                                selectOptions={{
                                    selectedItems: selectedPolicies,
                                    handleCheckbox: handlePolicyCheckbox,
                                }}
                                searchField={{
                                    handleSearch: setPolicySearchQuery,
                                    matchInfo: policySearchQuery.trim()
                                        ? `Matches: ${filteredPolicies.length}`
                                        : "",
                                }}
                            />
                        </div>
                    </>
                </FormComponent>
            </ModalComponent>
            <CustomTableComponent
                title="Subscription"
                description="Policy Subscription will be shown in here"
                dataFetchProgress={dataFetchProgress}
                headers={headers}
                pagination={subsPagination}
                body={filteredSubscriptions}
                onActionClick={(sub) => {
                    navigate(RoutePaths.SUBSCIPRTIONS + "/" + sub.id);
                }}
                actionButtons={actionButtons}
                renderCellValue={renderCellValue}
                searchField={{
                    handleSearch: setSearchQuery,
                    matchInfo: searchQuery.trim()
                        ? `Matches: ${filteredSubscriptions.length}`
                        : "",
                }}
            />
        </>
    );
}
