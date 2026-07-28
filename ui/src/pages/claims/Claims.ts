export const ClaimStatus = {
    ACTIVE: "Active",
    PENDING_APPROVAL: "Pending",
    OVERRIDE: "Override",
} as const;

// Extract a usable TypeScript type from the object values
export type ClaimStatus = (typeof ClaimStatus)[keyof typeof ClaimStatus];

export interface PolicyClaim {
    id: string | number;
    customerName: string;
    email: string;
    policyType: string;
    status: ClaimStatus;
    premium: string;
}