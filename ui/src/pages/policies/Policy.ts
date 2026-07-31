export const PolicyStatus = {
    ACTIVE: "Active",
    TERMINATED: "Terminated",
} as const;

export type PolicyStatus = (typeof PolicyStatus)[keyof typeof PolicyStatus];

export interface Policy {
    id: number;
    policyId: string;
    customerName: string;
    email: string;
    policyType: string;
    status: PolicyStatus;
    premium: string;
    description: string;
    coverageAmount: number;
    coverageDuration: string;
    premiumsDuration: string;
    isLatest: boolean;
    createdAt: string;
    updatedAt: string;
    //  Document document;
}
