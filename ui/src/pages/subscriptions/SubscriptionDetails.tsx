import {
    CheckIcon,
    ClockIcon,
    CloudArrowUpIcon,
    ExclamationCircleIcon,
    HandRaisedIcon,
    QuestionMarkCircleIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import { useParams } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import CustomTableComponent from "../../components/CustomTableComponent";
import DashboardLayout from "../../components/DashboardLayout";
import FormComponent, {
    type FormErrorsProps,
} from "../../components/FormComponent";
import ModalComponent from "../../components/ModalComponent";
import usePrincipal from "../../context/usePrincipal";
import { RoutePaths } from "../../routes/RoutePaths";
import ClaimsService, { type PolicyClaim } from "../../services/ClaimsService";
import type { Document } from "../../services/DocumentsService";
import DocumentsService, {
    DocumentType,
} from "../../services/DocumentsService";
import PremiumsService, {
    PaymentStatus,
    SubscriptionStatus,
    type PolicySubscription,
    type PremiumPayment,
} from "../../services/PremiumsService";
import {
    formatIsoDuration,
    isIsoDuration,
    isNumericString,
} from "../../utils/ResponseHandlingUtils";
import useProfile from "../../context/useProfile";

export default function SubscriptionDetails() {
    const { id } = useParams<{ id: string }>();
    const { isCustomer } = usePrincipal();
    const { profile } = useProfile();
    const [subscription, setSubscription] = useState<PolicySubscription>();
    const [dataFetchProgress, setDataFetchProgress] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrorsProps | null>({
        type: "error",
        errors: [],
    });
    const [secondsLeft, setSecondsLeft] = useState<number>(0);

    const uploadFileRef = useRef<HTMLInputElement>(null);
    const [allDocuments, setAllDocs] = useState<Document[]>([]);
    const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [docUploadProgress, setDocUploadProgress] = useState(false);
    const [showNewDoc, setShowNewDoc] = useState(false);
    const [docRefreshProgress] = useState(false);

    const refreshDocuments = useCallback(() => {
        DocumentsService.getAllDocumentsByType<Document[]>(
            DocumentType.CLAIM_PROOF,
        ).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setAllDocs(resp);
            } else {
                setAllDocs([]);
            }
            setDataFetchProgress(false);
        });
    }, []);

    const fetchSubscription = useCallback(() => {
        if (!id) return;
        PremiumsService.getSubscriptionById<PolicySubscription>(id)
            .then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setSubscription(resp);
                }
            })
            .catch((error) => {
                console.error("Failed to fetch subscription:", error);
            });
    }, [id]);

    useEffect(() => {
        fetchSubscription();
        refreshDocuments();
    }, [refreshDocuments, fetchSubscription]);

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

    function acceptSubscription() {
        PremiumsService.acceptSubscription<PolicySubscription>({
            subscriptionId: id,
        }).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setSubscription(resp);
            }
        });
    }

    function payPremium(prem: PremiumPayment) {
        window.alert(prem.id);
    }

    function raiseClaim(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (selectedDocuments.length == 0) {
            setFormErrors({
                type: "error",
                errors: [
                    "Claim Proof must be attached. Please select atleast one.",
                ],
            });
            return;
        }

        const claimData = new FormData(e.currentTarget);
        const payload = {
            subscriptionId: id,
            customerId: profile?.id,
            reason: claimData.get("reason"),
            proofs: selectedDocuments.map((id) => {
                return {
                    docId: id,
                };
            }),
        };

        ClaimsService.raiseClaim<PolicyClaim>(payload).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setFormErrors({
                    type: "success",
                    errors: [`Claim Raised with id ${resp.claimId}`],
                });
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

    const actionButtons = isCustomer()
        ? subscription?.status == SubscriptionStatus.PENDING
            ? [
                  {
                      text: "Accept",
                      icon: CheckIcon,
                      unsetClass: true,
                      className: "bg-emerald-400",
                      onClick: acceptSubscription,
                  },
              ]
            : subscription?.status == SubscriptionStatus.ACTIVE
              ? [
                    {
                        text: "Claim",
                        icon: HandRaisedIcon,
                        unsetClass: true,
                        className: "bg-emerald-400",
                        onClick: () => setIsModalOpen(true),
                    },
                ]
              : []
        : [];

    const handleDocumentCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        const docId = Number(e.target.value);
        const isChecked = e.target.checked;

        if (isChecked) {
            setSelectedDocuments([docId]);
        } else {
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

        const payload = new FormData();
        payload.append("fileName", String(uploadedFile.name));
        payload.append("documentType", DocumentType.CLAIM_PROOF);
        payload.append("file", uploadedFile);

        DocumentsService.uploadDocument<Document>(payload).then((resp) => {
            if (resp && "errorMessage" in resp) {
                setFormErrors(() => ({
                    type: "error",
                    errors: [resp.errorMessage],
                }));
            } else {
                setAllDocs((prev) => [resp, ...prev]);
                setUploadedFile(null);
                setShowNewDoc(true);
                setFormErrors(null);
            }
            setDocUploadProgress(false);
        });
    };

    return (
        <>
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Policy"
                maxWidthClass="max-w-6xl"
            >
                <FormComponent
                    handleSubmit={raiseClaim}
                    formErrors={formErrors}
                    actionText="Raise Claim"
                    icon={HandRaisedIcon}
                    secondsLeft={secondsLeft}
                    closeModal={() => setIsModalOpen(false)}
                    showFooter
                >
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Reason
                        </label>
                        <textarea
                            rows={3}
                            name="reason"
                            placeholder="reason please"
                            className="w-full shadow-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div className="md:row-span-2 col-span-full">
                        <div className="relative shadow-sm border border-slate-200 dark:border-slate-800 rounded-lg">
                            <div className="sticky inline-flex gap-4 items-center justify-between h-2/6 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 capitalize bg-slate-100/60 dark:bg-slate-700/20 border-b border-b-slate-200 dark:border-slate-800 w-full">
                                <span>Select Document</span>
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
                                                    No Documents Available
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
                </FormComponent>
            </ModalComponent>
            <DashboardLayout
                title="Subcription"
                description="Details of the subscription were shown below"
                dataFetchProgress={dataFetchProgress}
                breadCrumbs={{
                    anchors: [
                        {
                            text: "Subscriptions",
                            uri: RoutePaths.SUBSCIPRTIONS,
                        },
                        {
                            text: `${id}`,
                            uri: "#",
                        },
                    ],
                }}
                actionButtons={actionButtons}
            >
                <div className="flex flex-col gap-3">
                    <div className="col-span-full rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-800 p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="col-span-full flex flex-row gap-2 shadow-sm justify-center-safe py-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                            <span className="text-slate-800 dark:text-slate-200">
                                Subscription Status
                            </span>
                            <span className="text-slate-800 dark:text-slate-200">
                                {renderCellValue(subscription?.status)}
                            </span>
                        </div>
                        <div className="col-span-full">
                            <span className="text-slate-800 dark:text-slate-200">
                                Customer details
                            </span>
                        </div>
                        <div>
                            Name: {subscription?.customer?.firstName}{" "}
                            {subscription?.customer?.lastName}
                        </div>
                        <div>Email: {subscription?.customer?.email}</div>
                        <div>Phone: {subscription?.customer?.phone}</div>
                    </div>
                    <div className="col-span-full rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-800 p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="col-span-full">
                            <span className="text-slate-800 dark:text-slate-200">
                                Agent details
                            </span>
                        </div>
                        <div>
                            Name: {subscription?.agent?.firstName}{" "}
                            {subscription?.agent?.lastName}
                        </div>
                        <div>Email: {subscription?.agent?.email}</div>
                        <div>Phone: {subscription?.agent?.phone}</div>
                    </div>
                    <div className="col-span-full rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-800 p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="col-span-full flex flex-col md:flex-row gap-2">
                            <span className="text-slate-800 dark:text-slate-200">
                                Policy details
                            </span>
                        </div>
                        <div className="capitalize">
                            ID: {subscription?.policy.policyId}
                        </div>
                        <div className=" col-span-2">
                            Description:
                            {subscription?.policy.description}
                        </div>
                        <div className="capitalize">
                            policyType: {subscription?.policy.policyType}
                        </div>
                        <div className="capitalize">
                            status: {subscription?.policy.status}
                        </div>
                        <div className="capitalize">
                            coverage Amount: ₹{" "}
                            {subscription?.policy.coverageAmount}
                        </div>
                        <div className="capitalize">
                            coverageDuration:
                            {subscription?.policy.coverageDuration}
                        </div>
                        <div className="capitalize">
                            premiumsDuration:
                            {subscription?.policy.premiumsDuration}
                        </div>
                    </div>
                    <CustomTableComponent
                        title="Premiums"
                        headers={[
                            "id",
                            "premiumAmount",
                            "status",
                            "dueDate",
                            // "createdA",
                        ]}
                        itemActionText="Pay"
                        onActionClick={payPremium}
                        body={subscription?.payments ?? []}
                        renderCellValue={renderCellValue}
                    />
                </div>
            </DashboardLayout>
        </>
    );
}
