import {
    CalendarIcon,
    EnvelopeIcon,
    ExclamationCircleIcon,
    IdentificationIcon,
    PencilIcon,
    PhoneIcon,
    ShieldCheckIcon,
    TrashIcon,
    UserIcon,
    UserPlusIcon,
} from "@heroicons/react/24/outline";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import FemaleProfile from "../../assets/undraw_female-avatar_7t6k.svg";
import MaleProfile from "../../assets/undraw_male-avatar_zkzx.svg";
import usePagination from "../../components/common/usePagination";
import CustomTableComponent from "../../components/CustomTableComponent";
import DashboardLayout from "../../components/DashboardLayout";
import FormComponent, {
    type FormErrorsProps,
} from "../../components/FormComponent";
import ModalComponent from "../../components/ModalComponent";
import UserCardComponent from "../../components/UserCardComponent";
import usePrincipal, { RoleType } from "../../context/usePrincipal";
import useProfile, {
    UserGender,
    type UserProfile,
} from "../../context/useProfile";
import AccountService from "../../services/AccountService";
import PolicyService from "../../services/PolicyService";
import PremiumsService, {
    type PolicySubscription,
} from "../../services/PremiumsService";
import {
    formatIsoDuration,
    isIsoDuration,
    isNumericString,
} from "../../utils/ResponseHandlingUtils";
import { PolicyStatus, type Policy } from "../policies/Policy";

const POLICY_TABLE_HEADERS: string[] = [
    "policyId",
    "policyType",
    "coverageAmount",
    "coverageDuration",
    "premiumsDuration",
];

const POLICY_KEYS_MAP = POLICY_TABLE_HEADERS.reduce<Record<string, string>>(
    (acc, key) => {
        acc[key.toLowerCase()] = key;
        return acc;
    },
    {},
);

export default function ManageUsers() {
    const { isAdmin, isAgent } = usePrincipal();
    const { profile } = useProfile();
    const [allCustomers, setAllCustomers] = useState<UserProfile[]>([]);
    const [updateProfile, setUpdateProfile] = useState<UserProfile | null>();
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrorsProps | null>({
        type: "error",
        errors: [],
    });
    const [dataFetchProgress, setDataFetchProgress] = useState(true);
    const [secondsLeft, setSecondsLeft] = useState<number>(0);

    const [allPolicies, setAllPolicies] = useState<Policy[]>([]);
    const [selectedPolicies, setSelectedPolicies] = useState<Policy[]>([]);
    const [policySearchQuery, setPolicySearchQuery] = useState<string>("");
    const [userType, setUserType] = useState<string | null>(null);

    const refreshCustomers = useCallback(() => {
        AccountService.getAllUsers<UserProfile[]>().then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                if (isAgent()) {
                    setAllCustomers(
                        resp.filter(
                            (u) =>
                                !(
                                    u.roles.includes(RoleType.ADMIN) ||
                                    u.roles.includes(RoleType.AGENT) ||
                                    u.id == profile?.id
                                ),
                        ),
                    );
                } else {
                    setAllCustomers(resp.filter((u) => u.id != profile?.id));
                }
            }
            setDataFetchProgress(false);
        });
    }, [isAgent, profile]);

    const refreshPolices = useCallback(() => {
        PolicyService.getAllPolicies<Policy[]>().then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setAllPolicies(resp);
            }
            setDataFetchProgress(false);
        });
    }, []);

    useEffect(() => {
        refreshCustomers();
    }, [refreshCustomers, dataFetchProgress]);

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

    const addCustomer = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const customerData = new FormData(e.currentTarget);
        const formFields = Object.fromEntries(customerData.entries());

        const payload = {
            ...formFields,
            role: customerData.get("role") ?? RoleType.CUSTOMER,
            address: {
                street: customerData.get("street"),
                pinCode: customerData.get("pinCode"),
                state: customerData.get("state"),
                country: customerData.get("country"),
            },
        };
        // ? New Customer
        if (updateProfile == null) {
            if (userType == RoleType.CUSTOMER) {
                if (selectedPolicies.length == 0) {
                    setFormErrors({
                        type: "error",
                        errors: ["No policy selected!"],
                    });
                    return;
                }
                AccountService.createUser<UserProfile>(payload).then((resp) => {
                    if (resp && "errorMessage" in resp) {
                        setFormErrors({
                            type: "error",
                            errors:
                                resp.validationErrors != null &&
                                resp.validationErrors.length > 0
                                    ? [
                                          ...resp.validationErrors.map(
                                              (er) =>
                                                  er.field + ": " + er.message,
                                          ),
                                      ]
                                    : [resp.errorMessage],
                        });
                    } else {
                        setFormErrors({
                            type: "success",
                            errors: [
                                `Customer registered Successfully ID:[${resp.id}]`,
                            ],
                        });
                        refreshCustomers();
                        createSubscription(
                            resp.id,
                            selectedPolicies.map((pol) => pol.id),
                            customerData.get("premiumAmount") ?? "",
                            customerData.get("startDate") ?? "",
                        );
                    }
                });
            } else {
                AccountService.createUser<UserProfile>(payload).then((resp) => {
                    if (resp && "errorMessage" in resp) {
                        setFormErrors({
                            type: "error",
                            errors:
                                resp.validationErrors != null &&
                                resp.validationErrors.length > 0
                                    ? [
                                          ...resp.validationErrors.map(
                                              (er) =>
                                                  er.field + ": " + er.message,
                                          ),
                                      ]
                                    : [resp.errorMessage],
                        });
                    } else {
                        setFormErrors({
                            type: "success",
                            errors: [
                                `User registered Successfully ID:[${resp.id}]`,
                            ],
                        });
                        refreshCustomers();
                        setSecondsLeft(5);
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
                });
            }
        } else {
            const payload = {
                ...formFields,
                role: customerData.get("role") ?? RoleType.CUSTOMER,
                address: {
                    street: customerData.get("street"),
                    pinCode: customerData.get("pinCode"),
                    state: customerData.get("state"),
                    country: customerData.get("country"),
                },
            };
            AccountService.updateProfile<UserProfile>(
                updateProfile.id,
                payload,
            ).then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setFormErrors({
                        type: "success",
                        errors: ["User updated successfully"],
                    });
                    setUpdateProfile(null);
                    refreshCustomers();
                    setSecondsLeft(5);
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
                } else {
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
                }
            });
        }
    };

    const createSubscription = (
        customerId: string,
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
                    setSelectedPolicies([]);
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

    const editCustomer = useCallback(
        (id: string) => {
            setUpdateProfile(allCustomers.filter((c) => c.id == id)[0]);
            setIsModalOpen(true);
        },
        [allCustomers],
    );
    const deleteCustomer = useCallback(
        (id: unknown) => {
            if (id == "98a3c0bb-cb15-45c4-ae0c-543530325273") {
                window.alert("Cannot Delete System Admin");
                return;
            }
            AccountService.deleteProfile<{ status: boolean }>(
                id as number,
            ).then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    window.alert("User Deleted Successfully");
                }
                refreshCustomers();
            });
        },
        [refreshCustomers],
    );

    const handleUserTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setUserType(e.target.value);
        if (e.target.value == RoleType.CUSTOMER) {
            refreshPolices();
        }
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

    const customerCards = useMemo(() => {
        return queryProfiles.map((customer) => ({
            id: customer.id,
            dp:
                customer.gender == UserGender.MALE
                    ? MaleProfile
                    : customer.gender == UserGender.FEMALE
                      ? FemaleProfile
                      : "src/assets/undraw_deep-thinker-avatar_6xg6.svg",
            name: `${customer.firstName} ${customer.lastName}`,
            email: customer.email,
            phone: customer.phone,
            actionButtons: [
                { text: "", icon: PencilIcon, onClick: editCustomer },
                { text: "", icon: TrashIcon, onClick: deleteCustomer },
            ],
        }));
    }, [queryProfiles, deleteCustomer, editCustomer]);

    const {
        currentPage,
        totalPages,
        currentItems: currentCustomers,
        goToNextPage,
        goToPrevPage,
        changePage,
    } = usePagination(customerCards, 8);

    const renderCellValue = (value: unknown) => {
        if (value == PolicyStatus.ACTIVE) {
            return (
                <span className="capitalize inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <ShieldCheckIcon className="size-3.5 text-emerald-500" />
                    {PolicyStatus.ACTIVE}
                </span>
            );
        }
        // if (value === PolicyStatus.PENDING) {
        //     return (
        //         <span className="capitalize inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
        //             <ClockIcon className="size-3.5 text-amber-500" />
        //             {PolicyStatus.PENDING}
        //         </span>
        //     );
        // }
        if (value === PolicyStatus.TERMINATED) {
            return (
                <span className="capitalize inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-700 dark:text-rose-400">
                    <ExclamationCircleIcon className="size-3.5 text-rose-500" />
                    {PolicyStatus.TERMINATED}
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

    const pagination = usePagination<Policy>(filteredPolicies, 10);

    return (
        <DashboardLayout
            title={`Registered Customers ${isAdmin() ? "& Agents" : ""}`}
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
            dataFetchProgress={dataFetchProgress}
            actionButtons={[
                {
                    text: "Register",
                    icon: UserPlusIcon,
                    onClick: () => {
                        setIsModalOpen(true);
                        setUpdateProfile(null);
                    },
                },
            ]}
        >
            <ModalComponent
                isOpen={isModalOpen}
                icon={UserPlusIcon}
                onClose={() => setIsModalOpen(false)}
                title="New Registration Form"
                maxWidthClass="max-w-6xl"
            >
                <FormComponent
                    handleSubmit={addCustomer}
                    formErrors={formErrors}
                    actionText="Register"
                    icon={UserPlusIcon}
                    secondsLeft={secondsLeft}
                    closeModal={() => setIsModalOpen(false)}
                    showFooter
                >
                    <div className="">
                        FirstName:
                        <div className="w-full inline-flex gap-2 items-center rounded-lg border border-slate-200 dark:border-slate-800 ps-3 pe-1.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <label className="text-slate-700 dark:text-slate-300">
                                <UserIcon className="size-4" />
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                defaultValue={
                                    updateProfile ? updateProfile.firstName : ""
                                }
                                placeholder="first name"
                                className="w-full py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="">
                        Last Name:
                        <div className="w-full inline-flex gap-2 items-center rounded-lg border border-slate-200 dark:border-slate-800 ps-3 pe-1.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <label className="text-slate-700 dark:text-slate-300">
                                <UserIcon className="size-4" />
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                defaultValue={
                                    updateProfile ? updateProfile.lastName : ""
                                }
                                placeholder="last name"
                                className="w-full py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="">
                            Gender:
                            <div
                                className={`w-full inline-flex gap-2 items-center rounded-lg border border-slate-200 dark:border-slate-800 ps-3 pe-1.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${updateProfile != null ? "bg-slate-200 dark:bg-slate-700 cursor-not-allowed" : ""}`}
                            >
                                <label className="text-slate-700 dark:text-slate-300">
                                    <UserIcon className="size-4" />
                                </label>
                                <select
                                    className="w-full py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    name="gender"
                                    defaultValue={
                                        updateProfile
                                            ? updateProfile.gender
                                            : ""
                                    }
                                    required
                                    disabled={updateProfile != null}
                                >
                                    <option value="">Select</option>
                                    <option value="MALE">MALE</option>
                                    <option value="FEMALE">FEMALE</option>
                                    <option value="NON_DISCLOSED">
                                        NOT DISCLOSED
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="">
                            User Type:
                            <div className="w-full inline-flex gap-2 items-center rounded-lg border border-slate-200 dark:border-slate-800 ps-3 pe-1.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <label className="text-slate-700 dark:text-slate-300">
                                    <ShieldCheckIcon className="size-4" />
                                </label>
                                <select
                                    onChange={handleUserTypeChange}
                                    className="w-full py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    name="role"
                                    defaultValue={
                                        updateProfile
                                            ? updateProfile.roles[0]
                                            : ""
                                    }
                                    required
                                >
                                    <option value="">Select</option>
                                    {isAdmin() && (
                                        <>
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="AGENT">AGENT</option>
                                        </>
                                    )}
                                    <option value="CUSTOMER">CUSTOMER</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        Phone:
                        <div className="w-full inline-flex gap-2 items-center rounded-lg border border-slate-200 dark:border-slate-800 ps-3 pe-1.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <label className="text-slate-700 dark:text-slate-300">
                                <PhoneIcon className="size-4" />
                            </label>
                            <input
                                type="number"
                                onWheel={(e) =>
                                    (e.target as HTMLInputElement).blur()
                                }
                                onKeyDown={(e) => {
                                    if (
                                        ["e", "E", "-", "+", ".", ","].includes(
                                            e.key,
                                        )
                                    )
                                        e.preventDefault();
                                }}
                                min={0}
                                name="phone"
                                defaultValue={
                                    updateProfile ? updateProfile.phone : ""
                                }
                                pattern="\d*"
                                placeholder="phone number"
                                className="py-0.5 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="">
                        Email:
                        <div
                            className={`w-full inline-flex gap-2 items-center rounded-lg border border-slate-200 dark:border-slate-800 ps-3 pe-1.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${updateProfile != null ? "bg-slate-200 dark:bg-slate-700 cursor-not-allowed" : ""}`}
                        >
                            <label className="text-slate-700 dark:text-slate-300">
                                <EnvelopeIcon className="size-4" />
                            </label>
                            <input
                                type="email"
                                name="email"
                                defaultValue={
                                    updateProfile ? updateProfile.email : ""
                                }
                                placeholder="first name"
                                className="w-full py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                required
                                disabled={updateProfile != null}
                            />
                        </div>
                    </div>
                    <div className="">
                        Date Of Birth:
                        <div
                            className={`w-full inline-flex gap-2 items-center rounded-lg border border-slate-200 dark:border-slate-800 ps-3 pe-1.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${updateProfile != null ? "bg-slate-200 dark:bg-slate-700 cursor-not-allowed" : ""}`}
                        >
                            <label className="text-slate-700 dark:text-slate-300">
                                <EnvelopeIcon className="size-4" />
                            </label>
                            <input
                                type="date"
                                name="dob"
                                defaultValue={
                                    updateProfile ? updateProfile.dob : ""
                                }
                                className="w-full py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="">
                        Address Street-1:
                        <div className="w-full inline-flex gap-2 items-center rounded-lg border border-slate-200 dark:border-slate-800 ps-3 pe-1.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <label className="text-slate-700 dark:text-slate-300">
                                <IdentificationIcon className="size-4" />
                            </label>
                            <input
                                type="text"
                                name="street"
                                defaultValue={
                                    updateProfile
                                        ? updateProfile.address.street
                                        : ""
                                }
                                placeholder="first name"
                                className="w-full py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="">
                        PinCode:
                        <div className="w-full inline-flex gap-2 items-center rounded-lg border border-slate-200 dark:border-slate-800 ps-3 pe-1.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <label className="text-slate-700 dark:text-slate-300">
                                <IdentificationIcon className="size-4" />
                            </label>
                            <input
                                type="text"
                                name="pinCode"
                                defaultValue={
                                    updateProfile
                                        ? updateProfile.address.pinCode
                                        : ""
                                }
                                placeholder="first name"
                                className="w-full py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="">
                        State:
                        <div className="w-full inline-flex gap-2 items-center rounded-lg border border-slate-200 dark:border-slate-800 ps-3 pe-1.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <label className="text-slate-700 dark:text-slate-300">
                                <IdentificationIcon className="size-4" />
                            </label>
                            <input
                                type="text"
                                name="state"
                                defaultValue={
                                    updateProfile
                                        ? updateProfile.address.state
                                        : ""
                                }
                                placeholder="first name"
                                className="w-full py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="">
                        Country:
                        <div className="w-full inline-flex gap-2 items-center rounded-lg border border-slate-200 dark:border-slate-800 ps-3 pe-1.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <label className="text-slate-700 dark:text-slate-300">
                                <IdentificationIcon className="size-4" />
                            </label>
                            <input
                                type="text"
                                name="country"
                                defaultValue={
                                    updateProfile
                                        ? updateProfile.address.country
                                        : ""
                                }
                                placeholder="first name"
                                className="w-full py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                required
                            />
                        </div>
                    </div>
                    {userType == RoleType.CUSTOMER && updateProfile == null && (
                        <>
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
                                            (
                                                e.target as HTMLInputElement
                                            ).blur()
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
                                    pagination={pagination}
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
                    )}
                </FormComponent>
            </ModalComponent>
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
