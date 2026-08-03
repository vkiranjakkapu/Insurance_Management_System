export const PolicyStatus = {
    ACTIVE: "ACTIVE",
    TERMINATED: "TERMINATED",
} as const;

export type PolicyStatus = (typeof PolicyStatus)[keyof typeof PolicyStatus];

export interface Policy {
    id: number;
    policyId: string;
    customerName: string;
    email: string;
    policyType: string;
    status: PolicyStatus;
    description: string;
    document: Document;
    coverageAmount: number;
    coverageDuration: string;
    premiumsDuration: string;
    isLatest: boolean;
    createdAt: string;
    updatedAt: string;
    //  Document document;
}
