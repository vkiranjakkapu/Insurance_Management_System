import {
    DocumentPlusIcon,
    ExclamationCircleIcon,
    PlusIcon,
    ShieldCheckIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../routes/RoutePaths";
import { PolicyStatus, type Policy } from "./Policy";

import {
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import ActionButton from "../../components/ActionButton";
import usePagination from "../../components/common/usePagination";
import CustomTableComponent from "../../components/CustomTableComponent";
import LoadingPortalComponent from "../../components/LoadingPortalComponent";
import ModalComponent from "../../components/ModalComponent";
import samplePolicies from "../../data/samplePolicies.json";
import PolicyService from "../../services/PolicyService";

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
    // const [showToast, setShowToast] = useState<boolean>(false);
    // const [toast, setToast] = useState<ToastProps>({
    //     message: "",
    //     onClose: () => {},
    // });

    const [allPolicies, setAllPolicies] = useState<Policy[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    // Safely check for headers fallback
    const [headers, setHeaders] = useState<string[]>([]);
    // 1. Initialise the list state to hold numbers
    const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);

    const [formErrors, setFormErrors] = useState<{
        type: string;
        errors: string[];
    } | null>({
        type: "error",
        errors: [],
    });

    useEffect(() => {
        PolicyService.getAllPolicies().then((resp) => {
            if ("errorMessage" in resp) {
                // setShowToast(true);
                // setToast({
                //     message: resp.errorMessage,
                //     type: "error",
                //     onClose: () => setShowToast(true),
                // });
            } else {
                setAllPolicies(resp);
                if (resp.length != 0) {
                    setHeaders(Object.keys(resp[0]));
                } else {
                    setHeaders(["No Policies Available To Display"]);
                }
            }
        });
    }, []);

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

    function addPolicy(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormErrors(null);
        if (selectedDocuments.length == 0) {
            setFormErrors((prev) => ({
                type: "error", // fallback safely if prev is null
                errors: [
                    ...(prev?.errors ?? []),
                    "Policy Document Not Selected!",
                ],
            }));

            return;
        }
        const policyData = new FormData(e.currentTarget);
        const formFields = Object.fromEntries(policyData.entries());
        const payload = {
            ...formFields,
            coverageDuration: `P${policyData.get("coverageDuration")}${policyData.get("coverageDurationType") == "month" ? "M" : "Y"}`,
            premiumsDuration: `P${policyData.get("premiumDuration")}${policyData.get("premiumDurationType") == "month" ? "M" : "Y"}`,
            documentId: selectedDocuments[0], // Passes your numeric array state cleanly
        };
        console.log(payload);

        PolicyService.createPolicy(payload).then((resp) => {
            if ("errorMessage" in resp) {
                setFormErrors((prev) => ({
                    type: "error", // fallback safely if prev is null
                    errors: [...(prev?.errors ?? []), resp.errorMessage],
                }));
            } else {
                setFormErrors(() => ({
                    type: "success", // fallback safely if prev is null
                    errors: [`Policy [${resp.policyId}] has been created.`],
                }));
            }
        });

        // setIsModalOpen(false); // Close on execution success
    }

    const renderCellValue = (value: unknown) => {
        if (value === PolicyStatus.ACTIVE) {
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

        return String(value ?? "");
    };

    // 2. The handler function that adds or removes the ID
    const handleDocumentCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        const docId = Number(e.target.value); // Convert string value to a number
        const isChecked = e.target.checked; // Get the current checked status

        if (isChecked) {
            // Add ID if it is not already in the list
            setSelectedDocuments([docId]);
            // setSelectedDocuments((prev) => [...prev, docId]);
        } else {
            // Filter out the ID to remove it from the list
            setSelectedDocuments([]);
            // setSelectedDocuments((prev) => prev.filter((id) => id !== docId));
        }
    };

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
                    onSubmit={addPolicy}
                    className="space-y-4 px-2 grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                    {formErrors && formErrors?.errors.length > 0 && (
                        <div
                            className={`p-2.5 col-span-full flex flex-row gap-2 dark:text-white text-sm rounded-lg 
                                ${
                                    formErrors.type == "success"
                                        ? " bg-green-600/10 dark:bg-green-600/20 text-green-800/70"
                                        : " bg-red-600/10 dark:bg-red-600/20 text-red-800/70"
                                }`}
                        >
                            <ExclamationCircleIcon className="size-5" />
                            <span>{formErrors.errors.join(", ")}</span>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Policy Type
                        </label>
                        <div className="inline-flex items-center w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-1.5 ">
                            <select
                                name="policyType"
                                className="w-full capitalize shadow-smtext-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                defaultValue={""}
                                required
                            >
                                <option value="" disabled>
                                    Select
                                </option>
                                <option value="HEALTH">Health</option>
                                <option value="LIFE">Life</option>
                                <option value="HOME">Home</option>
                                <option value="VEHICLE">Vehicle</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Coverage Amount
                        </label>
                        <div className="inline-flex items-center w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-1.5 ">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 px-0.5 me-2">
                                ₹
                            </label>
                            <input
                                name="coverageAmount"
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
                                placeholder="amount"
                                className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-smtext-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 w-full md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Coverage Duration
                            </label>
                            <div className="w-full inline-flex rounded-lg border border-slate-200 dark:border-slate-800 ps-3 pe-1.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
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
                                    name="coverageDuration"
                                    pattern="\d*"
                                    min="1"
                                    step="1"
                                    placeholder="eg: 16 M | 2 Y"
                                    className="w-3/5 py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    required
                                />
                                <select
                                    name="coverageDurationType"
                                    id="duration"
                                    className="w-2/5 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg"
                                    defaultValue={""}
                                    required
                                >
                                    <option value="" disabled>
                                        period
                                    </option>
                                    <option value="month">Months</option>
                                    <option value="year">Years</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Premium Duration
                            </label>
                            <div className="w-full inline-flex rounded-lg border border-slate-200 dark:border-slate-800 ps-3 pe-1.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
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
                                    name="premiumDuration"
                                    pattern="\d*"
                                    min="1"
                                    step="1"
                                    placeholder="eg: 16 M | 2 Y"
                                    className="w-3/5 py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    required
                                />
                                <select
                                    name="premiumDurationType"
                                    id="duration"
                                    className="w-2/5 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg"
                                    defaultValue={""}
                                    required
                                >
                                    <option value="" disabled>
                                        period
                                    </option>
                                    <option value="month">Months</option>
                                    <option value="year">Years</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row-span-2">
                        <div className="relative shadow-sm border border-slate-200 dark:border-slate-800 rounded-lg">
                            <div className="sticky h-2/6 px-2 py-2.5 text-sm text-slate-700 dark:text-slate-300 capitalize bg-slate-100/60 dark:bg-slate-700/20 border-b border-b-slate-200 dark:border-slate-800 w-full">
                                Select Policy Document
                            </div>
                            <div className="h-32 overflow-scroll">
                                {[1, 2, 3, 4].map((el, idx) => (
                                    <div
                                        key={idx}
                                        className="px-3 py-0.5 w-full flex items-center border-b border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-sm text-slate-900 dark:text-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-colors duration-200"
                                    >
                                        <input
                                            type="checkbox"
                                            name="document"
                                            id={`file-${el}`}
                                            value={el} // Stays numeric in your code, but comes out as a string in the event
                                            className="me-2 cursor-pointer h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 disabled:bg-red-400"
                                            // Bind change listener
                                            onChange={handleDocumentCheckbox}
                                            // Controlled checkbox: returns true if the number 1 is in our array
                                            checked={selectedDocuments.includes(
                                                el,
                                            )}
                                        />
                                        <label
                                            htmlFor={`file-${el}`}
                                            className="cursor-pointer py-1.5 select-none w-full"
                                        >
                                            File Name - {el}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Description
                        </label>
                        <textarea
                            rows={2}
                            name="description"
                            placeholder="Short Description"
                            className="w-full shadow-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* Bottom Action Drawer buttons */}
                    <div className="col-span-full py-2 flex items-center justify-end space-x-3 pt-4 mt-6 border-t border-slate-200 dark:border-slate-800">
                        <ActionButton
                            text="Cancel"
                            onClick={() => setIsModalOpen(false)}
                            icon={XMarkIcon}
                            unsetClass={true}
                            className="p-1.5 flex flex-row items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        />
                        <ActionButton
                            text="Create"
                            onClick={() => {}}
                            icon={DocumentPlusIcon}
                            className="rounded-lg outline-1 outline-offset-1 outline-indigo-600"
                        />
                    </div>
                </form>
            </ModalComponent>

            {/* {showToast != false && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => {
                        setShowToast(false);
                    }}
                />
            )} */}
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
                renderCellValue={renderCellValue}
                searchField={{
                    handleSearch: setSearchQuery,
                    matchInfo: searchQuery.trim()
                        ? `Matches: ${filteredPolicies.length}`
                        : "",
                }}
            >
                <div>No data available to display</div>
            </CustomTableComponent>
        </>
    );
}
