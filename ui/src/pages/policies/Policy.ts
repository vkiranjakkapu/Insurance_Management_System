export const PolicyStatus = {
    ACTIVE: "Active",
    TERMINATED: "Terminated",
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
