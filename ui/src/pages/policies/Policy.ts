export const PolicyStatus = {
    Active: "ACTIVE",
    Pending: "PENDING_APPROVAL",
    Override: "OVERRIDE",
} as const;

// Extract a usable TypeScript type from the object values
export type PolicyStatus = (typeof PolicyStatus)[keyof typeof PolicyStatus];

export interface Policy {
    id: string | number;
    customerName: string;
    email: string;
    policyType: string;
    status: PolicyStatus;
    premium: string;
}
