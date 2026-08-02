import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import PremiumsService, {
    PaymentStatus,
    SubscriptionStatus,
    type PolicySubscription,
} from "../../services/PremiumsService";
import {
    ClockIcon,
    ExclamationCircleIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import {
    formatIsoDuration,
    isIsoDuration,
    isNumericString,
} from "../../utils/ResponseHandlingUtils";
import { useCallback, useState } from "react";
import CustomTableComponent from "../../components/CustomTableComponent";

export default function SubscriptionDetails() {
    const { id } = useParams<{ id: string }>();
    const [subscription, setSubscription] = useState<PolicySubscription>();

    useCallback(() => {
        PremiumsService.getSubscriptionById<PolicySubscription>(id).then(
            (resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setSubscription(resp);
                }
            },
        );
    }, [id]);

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

    return (
        <DashboardLayout title="Assign to Agent">
            <div className="col-span-full rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-800 p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="col-span-full">
                    <span className="text-slate-800 dark:text-slate-200">
                        Customer details
                    </span>
                </div>
                <div>{subscription?.customer.firstName}</div>
                <div>{subscription?.customer.lastName}</div>
                <div>{subscription?.customer.email}</div>
                <div>{subscription?.customer.phone}</div>
            </div>
            <div className="col-span-full rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-800 p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="col-span-full">
                    <span className="text-slate-800 dark:text-slate-200">
                        Agent details
                    </span>
                </div>
                <div>{subscription?.agent.firstName}</div>
                <div>{subscription?.agent.lastName}</div>
                <div>{subscription?.agent.email}</div>
                <div>{subscription?.agent.phone}</div>
            </div>
            <div className="col-span-full rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-800 p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="col-span-full">
                    <span className="text-slate-800 dark:text-slate-200">
                        Policy details
                    </span>
                </div>
                <div className="">{subscription?.policy.policyId}</div>
                <div className=" col-span-2">
                    {subscription?.policy.description}
                </div>
                <div className="">{subscription?.policy.policyType}</div>
                <div className="">{subscription?.policy.status}</div>
                <div className="">{subscription?.policy.coverageAmount}</div>
                <div className="">{subscription?.policy.coverageDuration}</div>
                <div className="">{subscription?.policy.premiumsDuration}</div>
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
                        body={subscription?.payments ?? []}
                        renderCellValue={renderCellValue}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
