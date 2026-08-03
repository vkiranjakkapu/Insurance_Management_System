import type { ErrorResponse } from "../api/api";
import { apiClient } from "../api/api";

class DocumentsService {
    async uploadDocument<T>(request: FormData): Promise<T | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "documents",
            uri: "/uploads/",
            payload: request,
        });
    }

    async getAllDocumentsByType<T>(
        type?: DocumentType,
    ): Promise<T | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "documents",
            uri: type
                ? type == DocumentType.POLICY_DOCUMENT
                    ? "/policies"
                    : type == DocumentType.CLAIM_PROOF
                      ? "/claims"
                      : "/kyc"
                : "",
        });
    }
}

export type Document = {
    id: number;
    ownerId: number;
    fileName: string;
    filePath: string;
    documentType: DocumentType;
};

export type DocUploadReq = {
    fileName: string;
    file: File | null;
    documentType: string;
};

export const DocumentType = {
    KYC: "KYC",
    CLAIM_PROOF: "CLAIM_PROOF",
    POLICY_DOCUMENT: "POLICY_DOCUMENT",
} as const;

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];

export default new DocumentsService();
