export const PolicyStatus = {
    ACTIVE: "Active",
    PENDING_APPROVAL: "Pending",
    OVERRIDE: "Override",
} as const;

export type PolicyStatus = (typeof PolicyStatus)[keyof typeof PolicyStatus];

export interface Policy {
    id: string | number;
    customerName: string;
    email: string;
    policyType: string;
    status: PolicyStatus;
    premium: string;
}
