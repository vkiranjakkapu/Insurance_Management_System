import { apiClient, type ErrorResponse } from "../api/api";
import type { UserProfile } from "../context/useProfile";
import type { Document } from "./DocumentsService";
import type { PolicySubscription } from "./PremiumsService";

class ClaimsService {
    async raiseClaim<T>(payload: unknown): Promise<T | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "claims",
            uri: "/",
            payload,
        });
    }

    async assignAgent<T>(payload: unknown): Promise<T | ErrorResponse> {
        return apiClient({
            type: "patch",
            service: "claims",
            uri: "/assign",
            payload,
        });
    }

    async updateClaim<T>(payload: unknown): Promise<T | ErrorResponse> {
        return apiClient({
            type: "put",
            service: "claims",
            uri: "/",
            payload,
        });
    }

    async getClaimById<T>(id: unknown): Promise<T | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "claims",
            uri: "/" + id,
        });
    }

    async getAllCalims<T>(): Promise<T | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "claims",
            uri: "/",
        });
    }
}

export default new ClaimsService();

export const ClaimStatus = {
    INITIATED: "INITIATED",
    ASSIGNED: "ASSIGNED",
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
} as const;

export type ClaimStatus = (typeof ClaimStatus)[keyof typeof ClaimStatus];

export interface PolicyClaim {
    id: string | number;
    claimId: string;
    subscription: PolicySubscription;
    resolverName: string;
    customerId: string;
    customer: UserProfile;
    agentId: string;
    agent: UserProfile;
    reason: string;
    proofs: Document[];

    status: ClaimStatus;
    resolverId: string;
    resolver: UserProfile;
    updatedAt: string;
    createdAt: string;
}

export type ClaimProof = {
    id: string;
    claim: PolicyClaim;
    documentId: string;
    document: Document;
    createdAt: string;
};
