import axios from "axios";
import { AppConfig } from "../config/AppConfig";
import { handleErrorResponse } from "../utils/DurationHelper";
import configureRequestInterceptor from "./RequestInterceptor";
import configureResponseInterceptor from "./ResponseInterceptor";

const api = axios.create({
    baseURL: AppConfig.API_BASE_URL,
    timeout: 5000,
});

configureRequestInterceptor(api);
configureResponseInterceptor(api);

export default api;

export type ErrorResponse = {
    errorName: string;
    errorCode: string;
    errorMessage: string;
    validationErrors: ValidationErrors[];
    timestamp: string;
};

export type APIResponse = {
    status: string;
    body: object;
    timestamp: string;
};

export type ValidationErrors = {
    field: string;
    rejectedValue: object;
    message: string;
};

export type ApiClientProps = {
    type: "get" | "post" | "put" | "patch" | "delete";
    uri: string;
    service:
        | "identity"
        | "profile"
        | "policies"
        | "documents"
        | "claims"
        | "premiums"
        | "reports";
    payload?: unknown;
};

export async function apiClient<T>({
    type,
    uri,
    service,
    payload,
}: ApiClientProps): Promise<T | ErrorResponse> {
    try {
        let response, url;

        if (service == "identity") {
            url = AppConfig.IDENTITY_AUTH_URL;
        } else if (service == "profile") {
            url = AppConfig.IDENTITY_PROFILE_URL;
        } else if (service == "policies") {
            url = AppConfig.POLICY_SERVICE_URL;
        } else if (service == "documents") {
            url = AppConfig.DOCUMENTS_SERVICE_URL;
        } else if (service == "claims") {
            url = AppConfig.CLAIMS_SERVICE_URL;
        } else if (service == "premiums") {
            url = AppConfig.PREMIUMS_SERVICE_URL;
        } else {
            url = AppConfig.REPORTS_SERVICE_URL;
        }

        if (type.toLowerCase() == "post") {
            response = await api.post(url + uri, payload);
        } else if (type.toLowerCase() == "put") {
            response = await api.put(url + uri, payload);
        } else if (type.toLowerCase() == "patch") {
            response = await api.patch(url + uri, payload);
        } else if (type.toLowerCase() == "delete") {
            response = await api.delete(url + uri);
        } else {
            response = await api.get(url + uri);
        }

        const apiResponse = response.data as {
            status: string;
            body: T;
            timestamp: string;
        };
        
        return apiResponse.body;
    } catch (er) {
        return handleErrorResponse(er);
    }
}
