import type { AxiosError } from "axios";
import api, { type ErrorResponse } from "../api/api";
import { AppConfig } from "../config/AppConfig";
import type { Policy } from "../pages/policies/Policy";

class PolicyService {
    async getAllPolicies(): Promise<Policy[] | ErrorResponse> {
        try {
            const response = await api.get(
                AppConfig.POLICY_SERVICE_URL + "/12",
            );
            const policies = response.data as {
                status: string;
                body: Policy[];
                timestamp: string;
            };
            return policies.body;
        } catch (er) {
            console.log(er);
            const error = er as AxiosError;
            return error.response?.data as ErrorResponse;
        }
    }

    async createPolicy(policyData: unknown): Promise<Policy | ErrorResponse> {
        try {
            const response = await api.post(
                AppConfig.POLICY_SERVICE_URL + "/",
                policyData,
            );
            const policy = response.data as {
                status: string;
                body: Policy;
                timestamp: string;
            };
            return policy.body;
        } catch (er) {
            console.log(er);
            const error = er as AxiosError;
            return error.response?.data as ErrorResponse;
        }
    }
}

export default new PolicyService();
