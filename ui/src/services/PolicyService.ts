import { apiClient, type ErrorResponse } from "../api/api";

class PolicyService {
    async getAllPolicies<T>(): Promise<T | ErrorResponse> {
        return apiClient<T>({
            type: "get",
            service: "policies",
            uri: "/",
        });
    }

    async createPolicy<T>(payload: unknown): Promise<T | ErrorResponse> {
        return apiClient<T>({
            type: "post",
            service: "policies",
            uri: "/",
            payload,
        });
    }
}

export default new PolicyService();
