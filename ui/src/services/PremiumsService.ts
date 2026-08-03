import { apiClient, type ErrorResponse } from "../api/api";
import type { UserProfile } from "../context/useProfile";
import type { Policy } from "../pages/policies/Policy";

class PremiumsService {
    async createSubscription<T>(payload: unknown): Promise<T | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "premiums",
            uri: "/subscriptions/",
            payload,
        });
    }

    async getAllSubscriptions<T>(): Promise<T | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "premiums",
            uri: "/subscriptions/",
        });
    }

    async getSubscriptionById<T>(id?: string): Promise<T | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "premiums",
            uri: "/subscriptions/" + id,
        });
    }

    async acceptSubscription<T>(payload: unknown): Promise<T | ErrorResponse> {
        return apiClient({
            type: "patch",
            service: "premiums",
            uri: "/subscriptions/",
            payload,
        });
    }
}

export default new PremiumsService();

export type PolicySubscription = {
    id: number;
    customer: UserProfile;
    customerName: string;
    policyId: string;
    policyType: string;
    agentEmail: string;
    policy: Policy;
    startDate: string;
    endDate: string;
    expiry: string;
    payments: PremiumPayment[];
    status: SubscriptionStatus;
    acceptanceTime: string;
    agent: UserProfile;
    updatedAt: string;
    createdA: string;
};

export const SubscriptionStatus = {
    ACTIVE: "ACTIVE",
    PENDING: "PENDING",
    EXPIRED: "EXPIRED",
} as const;
export type SubscriptionStatus =
    (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const PaymentStatus = {
    PENDING: "PENDING",
    PAID: "PAID",
    OVERDUE: "OVERDUE",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export type PremiumPayment = {
    id: number;
    subscription: PolicySubscription;
    customerId: number;
    method: string;
    amountPayed: number;
    premiumAmount: number;
    status: PaymentStatus;
    dueDate: string;
    paymentTime: string;
    createdAt: string;
};
