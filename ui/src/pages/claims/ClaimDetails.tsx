import {
    CheckCircleIcon,
    CheckIcon,
    ClockIcon,
    ExclamationCircleIcon,
    ShieldCheckIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import ActionButton, {
    type ActionButtonProps,
} from "../../components/ActionButton";
import DashboardLayout from "../../components/DashboardLayout";
import type { FormErrorsProps } from "../../components/FormComponent";
import usePrincipal, { RoleType } from "../../context/usePrincipal";
import type { UserProfile } from "../../context/useProfile";
import { RoutePaths } from "../../routes/RoutePaths";
import AccountService from "../../services/AccountService";
import type { PolicyClaim } from "../../services/ClaimsService";
import ClaimsService, { ClaimStatus } from "../../services/ClaimsService";

export default function ClaimDetails() {
    const { id: claimId } = useParams<{ id: string }>();
    const { isCustomer } = usePrincipal();

    const [claimDetails, setClaimsDetails] = useState<PolicyClaim>();
    const [fecthProgress, setFetchProgress] = useState(true);
    const [allAgents, setAllAgents] = useState<UserProfile[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<UserProfile>();
    const [formErrors, setFormErrors] = useState<FormErrorsProps | null>({
        type: "error",
        errors: [],
    });

    useEffect(() => {
        if (!claimId) return;
        ClaimsService.getClaimById<PolicyClaim>(claimId).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setClaimsDetails(resp);
                setFetchProgress(false);
            } else {
                console.log(resp);
            }
        });

        AccountService.getAllUsers<UserProfile[]>(RoleType.AGENT).then(
            (resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setAllAgents(resp);
                } else {
                    console.log(resp);
                }
            },
        );
    }, [claimId]);

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

    const assignAgent = () => {
        if (!selectedAgent) {
            setFormErrors({
                type: "error",
                errors: ["Please Select Agent!"],
            });
            return;
        } else {
            const payload = {
                claimId: claimDetails?.id,
                customerId: claimDetails?.subscription.customer.id,
                agentId: selectedAgent.id,
                dealerName:
                    selectedAgent.firstName + " " + selectedAgent.lastName,
            };
            ClaimsService.assignAgent<PolicyClaim>(payload).then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setFormErrors({
                        type: "success",
                        errors: [
                            `${selectedAgent.firstName}(${selectedAgent.email}) Successfully Assigned to` +
                                claimId,
                        ],
                    });
                    const intervalId = setTimeout(() => {
                        setFormErrors(null);
                    }, 10000);

                    return () => clearTimeout(intervalId);
                } else {
                    setFormErrors({
                        type: "error",
                        errors: [resp.errorMessage],
                    });
                }
            });
        }
    };

    function handleAgentSelection(e: ChangeEvent<HTMLSelectElement>) {
        const agentId = e.target.value;
        setSelectedAgent(allAgents.filter((a) => a.id == agentId)[0]);
    }

    const approveClaim = () => {
        ClaimsService.updateClaim<PolicyClaim>({
            claimId: claimDetails?.id,
            status: ClaimStatus.APPROVED,
        }).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setClaimsDetails(resp);
                setFormErrors({
                    type: "success",
                    errors: ["Claim Approved Successfully"],
                });
                const intervalId = setTimeout(() => {
                    setFormErrors(null);
                }, 10000);

                return () => clearTimeout(intervalId);
            } else {
                setFormErrors({
                    type: "error",
                    errors: [resp.errorMessage],
                });
            }
        });
    };

    const rejectClaim = () => {
        ClaimsService.updateClaim<PolicyClaim>({
            claimId: claimDetails?.id,
            status: ClaimStatus.REJECTED,
        }).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setClaimsDetails(resp);
                setFormErrors({
                    type: "success",
                    errors: ["Claim Rejected Successfully"],
                });
                const intervalId = setTimeout(() => {
                    setFormErrors(null);
                }, 10000);

                return () => clearTimeout(intervalId);
            } else {
                setFormErrors({
                    type: "error",
                    errors: [resp.errorMessage],
                });
            }
        });
    };

    const actionButtons: ActionButtonProps[] = !isCustomer()
        ? [
              {
                  text: "Approve",
                  icon: CheckCircleIcon,
                  theme: "emerald",
                  className: "disabled",
                  onClick: approveClaim,
              },
              {
                  text: "Reject",
                  icon: XCircleIcon,
                  theme: "rose",
                  className: "disabled",
                  onClick: rejectClaim,
              },
          ]
        : [];

    return (
        <DashboardLayout
            title="Claim Details"
            breadCrumbs={{
                anchors: [
                    {
                        text: "Claims",
                        uri: RoutePaths.CLAIMS,
                    },
                    {
                        text: `Claim: ${claimId}`,
                        uri: "#",
                    },
                ],
            }}
            actionButtons={actionButtons}
            description={`Details about ${claimId}`}
            dataFetchProgress={fecthProgress}
        >
            <div className="flex flex-col gap-3">
                <div className="col-span-full rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-800 p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="col-span-full flex flex-row gap-2 shadow-sm justify-center-safe py-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-800 dark:text-slate-200">
                            Claim Status
                        </span>
                        <span className="text-slate-800 dark:text-slate-200">
                            {renderCellValue(claimDetails?.status)}
                        </span>
                    </div>
                    <div className="col-span-full">
                        {formErrors && formErrors?.errors.length > 0 && (
                            <div
                                className={`p-2.5 col-span-full flex flex-row gap-2 items-center dark:text-white text-sm rounded-lg 
                            ${
                                formErrors.type == "success"
                                    ? " bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                    : " bg-rose-500/10 text-rose-700 dark:text-rose-400"
                            }`}
                            >
                                {formErrors.type == "error" ? (
                                    <ExclamationCircleIcon
                                        className={`text-rose-500 size-4`}
                                    />
                                ) : (
                                    <CheckCircleIcon className="text-emerald-500 size-4" />
                                )}
                                <span>{formErrors.errors.join(", ")}</span>
                            </div>
                        )}
                    </div>
                    <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="">
                            <div className="text-slate-800 dark:text-slate-200 mb-3">
                                Customer details
                            </div>
                            <div>
                                Name:{" "}
                                {claimDetails?.subscription.customer.firstName}{" "}
                                {claimDetails?.subscription.customer.lastName}
                            </div>
                            <div>
                                Email:{" "}
                                {claimDetails?.subscription.customer.email}
                            </div>
                            <div>
                                Phone:{" "}
                                {claimDetails?.subscription.customer.phone}
                            </div>
                            <div>
                                Submitted Documents:{" "}
                                {claimDetails?.proofs
                                    .map((p) => p.fileName)
                                    .join(", ")}
                            </div>
                        </div>
                        {/* Assign Agent Section */}
                        {!isCustomer() && (
                            <div className="flex flex-col gap-3 p-2 items-start justify-center rounded-lg shadow-sm bg-slate-100 dark:bg-slate-700/60">
                                <span className="text-slate-800 dark:text-slate-200">
                                    {claimDetails?.status ==
                                    ClaimStatus.INITIATED
                                        ? "Assign Agent"
                                        : "Change Agent"}
                                </span>
                                <div className="inline-flex items-center w-full rounded-lg bg-white dark:bg-transparent border border-slate-200 dark:border-slate-800 overflow-hidden">
                                    <select
                                        onChange={handleAgentSelection}
                                        className="w-full mx-0.5 capitalize shadow-smtext-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        defaultValue={""}
                                        required
                                    >
                                        <option value="" disabled>
                                            Select Agent
                                        </option>
                                        {allAgents.map((agent, idx) => {
                                            return (
                                                <option
                                                    value={agent.id}
                                                    key={idx}
                                                >
                                                    {agent.email}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <ActionButton
                                        onClick={assignAgent}
                                        type="submit"
                                        text="Assign"
                                        icon={CheckIcon}
                                        unsetClass={true}
                                        className="inline-flex cursor-pointer gap-2 p-1.5 items-center bg-indigo-700 text-white"
                                    />
                                </div>
                                <hr className="border border-slate-200 w-full" />
                                <div className="w-full flex items-start flex-col p-2">
                                    <p>Email: {selectedAgent?.email}</p>
                                    <p>
                                        Name:
                                        {selectedAgent?.firstName +
                                            " " +
                                            selectedAgent?.lastName}
                                    </p>
                                    <p>Phone: {selectedAgent?.phone}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {claimDetails?.agent ? (
                    <div className="col-span-full rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-800 p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="col-span-full">
                            <span className="text-slate-800 dark:text-slate-200">
                                Agent details
                            </span>
                        </div>
                        <div>
                            Name: {claimDetails?.agent?.firstName}{" "}
                            {claimDetails?.agent?.lastName}
                        </div>
                        <div>Email: {claimDetails?.agent?.email}</div>
                        <div>Phone: {claimDetails?.agent?.phone}</div>
                    </div>
                ) : (
                    <div className="col-span-full rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-800 p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                        Agent Not yet assigned.
                    </div>
                )}
                <div className="col-span-full rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-800 p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="col-span-full flex flex-col md:flex-row gap-2">
                        <span className="text-slate-800 dark:text-slate-200">
                            Policy details
                        </span>
                    </div>
                    <div className="capitalize">
                        ID: {claimDetails?.subscription.policy.policyId}
                    </div>
                    <div className=" col-span-2">
                        Description:
                        {claimDetails?.subscription.policy.description}
                    </div>
                    <div className="capitalize">
                        policyType:{" "}
                        {claimDetails?.subscription.policy.policyType}
                    </div>
                    <div className="capitalize">
                        status: {claimDetails?.subscription.policy.status}
                    </div>
                    <div className="capitalize">
                        coverage Amount: ₹{" "}
                        {claimDetails?.subscription.policy.coverageAmount}
                    </div>
                    <div className="capitalize">
                        coverageDuration:
                        {claimDetails?.subscription.policy.coverageDuration}
                    </div>
                    <div className="capitalize">
                        premiumsDuration:
                        {claimDetails?.subscription.policy.premiumsDuration}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
