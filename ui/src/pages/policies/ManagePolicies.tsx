import {
    CloudArrowUpIcon,
    DocumentPlusIcon,
    ExclamationCircleIcon,
    PlusIcon,
    QuestionMarkCircleIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../routes/RoutePaths";
import { PolicyStatus, type Policy } from "./Policy";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import ActionButton from "../../components/ActionButton";
import usePagination from "../../components/common/usePagination";
import CustomTableComponent from "../../components/CustomTableComponent";
import FormComponent, {
    type FormErrorsProps,
} from "../../components/FormComponent";
import LoadingPortalComponent from "../../components/LoadingPortalComponent";
import ModalComponent from "../../components/ModalComponent";
import DocumentsService, {
    DocumentType,
    type Document,
} from "../../services/DocumentsService";
import PolicyService from "../../services/PolicyService";
import {
    formatIsoDuration,
    isIsoDuration,
    isNumericString,
} from "../../utils/ResponseHandlingUtils";

const POLICY_TABLE_HEADERS: string[] = [
    "policyId",
    "policyType",
    "description",
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

export default function ManagePolicies() {
    const navigate = useNavigate();
    const uploadFileRef = useRef<HTMLInputElement>(null);
    const [allPolicies, setAllPolicies] = useState<Policy[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [headers, setHeaders] = useState<string[]>([]);

    const [allDocuments, setAllDocs] = useState<Document[]>([]);
    const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [docUploadProgress, setDocUploadProgress] = useState(false);
    const [showNewDoc, setShowNewDoc] = useState(false);
    const [docRefreshProgress] = useState(false);
    const [dataFetchProgress, setDataFetchProgress] = useState(true);
    const [secondsLeft, setSecondsLeft] = useState<number>(0);

    const [formErrors, setFormErrors] = useState<FormErrorsProps | null>({
        type: "error",
        errors: [],
    });

    const refreshPolicies = useCallback(() => {
        PolicyService.getAllPolicies<Policy[]>().then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setAllPolicies(resp);
                if (resp.length !== 0) {
                    setHeaders(POLICY_TABLE_HEADERS);
                } else {
                    setHeaders(["No Policies Available To Display"]);
                }
                setDataFetchProgress(false);
            }
        });
    }, []);

    const refreshDocuments = useCallback(() => {
        DocumentsService.getAllDocumentsByType(
            DocumentType.POLICY_DOCUMENT,
        ).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setAllDocs(resp);
            } else {
                setAllDocs([]);
                console.log(resp);
            }
        });
    }, []);

    useEffect(() => {
        refreshPolicies();
        refreshDocuments();
    }, [refreshPolicies, refreshDocuments]);

    const filteredPolicies = useMemo(() => {
        const query = searchQuery.trim();
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
    }, [searchQuery, allPolicies]);

    const pagination = usePagination<Policy>(filteredPolicies, 10);

    function fetchPolicy(policy: Policy) {
        navigate(`${RoutePaths.POLICIES}/${policy.policyId}`);
    }

    function addPolicy(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormErrors(null);
        if (selectedDocuments.length == 0) {
            setFormErrors((prev) => ({
                type: "error",
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
            coverageDuration: `P${policyData.get("coverageDur")}${policyData.get("coverageDurationType") == "month" ? "M" : "Y"}`,
            premiumsDuration: `P${policyData.get("premiumDur")}${policyData.get("premiumDurationType") == "month" ? "M" : "Y"}`,
            documentId: selectedDocuments[0], // Passes your numeric array state cleanly
        };

        PolicyService.createPolicy<Policy>(payload).then((resp) => {
            if ("errorMessage" in resp) {
                setFormErrors((prev) => ({
                    type: "error",
                    errors: [...(prev?.errors ?? []), resp.errorMessage],
                }));
            } else {
                setFormErrors(() => ({
                    type: "success",
                    errors: [`Policy [${resp.policyId}] has been created.`],
                }));
                refreshPolicies();
                setSecondsLeft(5);
            }
        });

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
            setSelectedDocuments((prev) => prev.filter((id) => id !== docId));
        }
    };

    const uploadFile = () => {
        setDocUploadProgress(true);

        if (!uploadedFile) {
            console.error("No file selected!");
            return;
        }

        // 1. Create the native FormData instance container
        const payload = new FormData();

        // 2. Append text key-value pairs matching backend fields
        payload.append("fileName", String(uploadedFile.name));
        payload.append("documentType", DocumentType.POLICY_DOCUMENT);

        // 3. Append the raw file binary payload
        payload.append("file", uploadedFile);

        DocumentsService.uploadDocument(payload).then((resp) => {
            if ("error" in resp) {
                setFormErrors(() => ({
                    type: "error",
                    errors: ["Error Uploading file"],
                }));
            }
            if ("errorMessage" in resp) {
                setFormErrors(() => ({
                    type: "error",
                    errors: [resp.errorMessage],
                }));
            } else {
                setAllDocs((prev) => [resp, ...prev]);
                setUploadedFile(null);
                setShowNewDoc(true);
            }
            setDocUploadProgress(false);
        });
    };

    return (
        <>
            <LoadingPortalComponent
                isLoading={false}
                message="Loading Policies"
                subMessage="please wait"
            />

            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Policy"
                maxWidthClass="max-w-6xl"
            >
                <FormComponent
                    handleSubmit={addPolicy}
                    formErrors={formErrors}
                    actionText="Create"
                    icon={DocumentPlusIcon}
                    secondsLeft={secondsLeft}
                    closeModal={() => setIsModalOpen(false)}
                >
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
                                <option value="HOME">House</option>
                                <option value="VEHICLE">Vehicle</option>
                            </select>
                        </div>
                    </div>
                    <div className="">
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
                                name="coverageDur"
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
                    <div className="">
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
                                name="premiumDur"
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
                                placeholder="coverage amount"
                                className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-smtext-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Premium Amount
                        </label>
                        <div className="inline-flex items-center w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-1.5 ">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 px-0.5 me-2">
                                ₹
                            </label>
                            <input
                                name="premiumAmount"
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
                                placeholder="premium amount"
                                className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-smtext-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="md:row-span-2">
                        <div className="relative shadow-sm border border-slate-200 dark:border-slate-800 rounded-lg">
                            <div className="sticky inline-flex gap-4 items-center justify-between h-2/6 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 capitalize bg-slate-100/60 dark:bg-slate-700/20 border-b border-b-slate-200 dark:border-slate-800 w-full">
                                <span>Select Policy Document</span>
                                <span className="hidden md:block">(OR)</span>
                                <ActionButton
                                    text="Upload"
                                    type="button"
                                    icon={CloudArrowUpIcon}
                                    onClick={() => {
                                        uploadFileRef.current?.click();
                                    }}
                                    className="p-0.5 rounded-lg outline-1 outline-indigo-500 outline-offset-1"
                                />
                                <input
                                    type="file"
                                    ref={uploadFileRef}
                                    onChange={(event) => {
                                        setUploadedFile(
                                            event.target.files != null
                                                ? event.target.files[0]
                                                : null,
                                        );
                                    }}
                                    name="upload"
                                    id="upload"
                                    className="hidden"
                                />
                            </div>
                            <div className="h-32 overflow-scroll">
                                {uploadedFile != null && (
                                    <div className="px-3 py-1.5 w-full flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-colors duration-200">
                                        <label className="cursor-pointer py-1.5 select-none w-full inline-flex items-center gap-2">
                                            {docUploadProgress && (
                                                <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600"></div>
                                            )}
                                            <p
                                                className={`${docUploadProgress && "animate-pulse"}}`}
                                            >
                                                {docUploadProgress
                                                    ? "Uploading"
                                                    : "Selected"}{" "}
                                                - {uploadedFile.name}
                                            </p>
                                            {!docUploadProgress && (
                                                <ActionButton
                                                    type="button"
                                                    onClick={uploadFile}
                                                    text="Confirm"
                                                    icon={
                                                        QuestionMarkCircleIcon
                                                    }
                                                    className="rounded-full px-1.5 text-sm"
                                                    disabled={docUploadProgress}
                                                />
                                            )}
                                        </label>
                                    </div>
                                )}
                                {allDocuments.length == 0 ? (
                                    <div className="p-3 w-full flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-sm text-slate-900 dark:text-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-colors duration-200">
                                        {docRefreshProgress ? (
                                            <span className="inline-flex gap-2 items-center">
                                                <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600"></div>
                                                Fetching documents...
                                            </span>
                                        ) : (
                                            <>
                                                <span>
                                                    No Policy Documents
                                                    Available
                                                </span>
                                                {/* <ActionButton
                                                    text="Refresh"
                                                    type="button"
                                                    className="rounded-lg"
                                                    icon={ArrowPathIcon}
                                                    onClick={() => {
                                                        setDocRefreshProgress(
                                                            true,
                                                        );
                                                        refreshDocuments();
                                                    }}
                                                /> */}
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    allDocuments.map((document, idx) => (
                                        <div
                                            key={idx}
                                            className="px-3 py-0.5 truncate w-full flex items-center border-b border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-sm text-slate-900 dark:text-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-colors duration-200"
                                        >
                                            <input
                                                type="checkbox"
                                                name="document"
                                                id={`file-${document.id}`}
                                                value={document.id} // Stays numeric in your code, but comes out as a string in the event
                                                className="me-2 cursor-pointer h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 disabled:bg-red-400"
                                                // Bind change listener
                                                onChange={
                                                    handleDocumentCheckbox
                                                }
                                                // Controlled checkbox: returns true if the number 1 is in our array
                                                checked={selectedDocuments.includes(
                                                    document.id,
                                                )}
                                            />
                                            <label
                                                htmlFor={`file-${document.id}`}
                                                className="cursor-pointer inline-flex justify-between py-1.5 select-none w-full truncate"
                                            >
                                                <span>{document.fileName}</span>
                                                {showNewDoc && idx == 0 && (
                                                    <span className="capitalize inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                                                        <ExclamationCircleIcon className="size-3.5 text-emerald-500" />
                                                        new
                                                    </span>
                                                )}
                                            </label>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            name="description"
                            placeholder="Short Description"
                            className="w-full shadow-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                </FormComponent>
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
                dataFetchProgress={dataFetchProgress}
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
            />
        </>
    );
}
