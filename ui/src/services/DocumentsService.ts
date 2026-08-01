import type { ErrorResponse } from "../api/api";
import api from "../api/api";
import { AppConfig } from "../config/AppConfig";
import { handleErrorResponse } from "./ErrorRsponseHandling";

class DocumentsService {
    async uploadDocument(request: FormData): Promise<Document | ErrorResponse> {
        try {
            const response = await api.post(
                AppConfig.DOCUMENTS_SERVICE_URL + "/uploads/",
                request,
            );
            const document = response.data as {
                status: string;
                body: Document;
                timestamp: string;
            };
            return document.body;
        } catch (er) {
            return handleErrorResponse(er);
        }
    }

    async getAllDocumentsByType(
        type: DocumentType,
    ): Promise<Document[] | ErrorResponse> {
        const uri = type
            ? type == DocumentType.POLICY_DOCUMENT
                ? "/policies"
                : type == DocumentType.CLAIM_PROOF
                  ? "/claims"
                  : "/kyc"
            : "";
        try {
            const response = await api.get(
                AppConfig.DOCUMENTS_SERVICE_URL + uri,
            );
            const document = response.data as {
                status: string;
                body: Document[];
                timestamp: string;
            };
            return document.body;
        } catch (er) {
            return handleErrorResponse(er);
        }
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
