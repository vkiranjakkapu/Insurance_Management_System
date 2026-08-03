import api, { apiClient, type ErrorResponse } from "../api/api";
import { AppConfig } from "../config/AppConfig";
import type { RoleType } from "../context/usePrincipal";
import type { Address } from "../context/useProfile";

export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: Address;
    dob: string;
    enabled: boolean;
    roles: string[];
    createdAt: string;
    updatedAt: string;
}

class AccountService {
    async getMyProfile(): Promise<UserResponse> {
        const response = await api.get(AppConfig.IDENTITY_PROFILE_URL + "/me");

        if (response.status != 200) {
            console.log("Failed to fetch UserDetails");
        }

        return response.data;
    }

    async getAllUsers<T>(role?: RoleType): Promise<T | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "profile",
            uri: role ? "/role/" + role : "/",
        });
    }

    async createUser<T>(payload: object): Promise<T | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "profile",
            uri: "/",
            payload,
        });
    }

    async updateProfile<T>(
        id: string,
        payload: object,
    ): Promise<T | ErrorResponse> {
        return apiClient({
            type: "put",
            service: "profile",
            uri: "/" + id,
            payload,
        });
    }

    async deleteProfile<T>(id: number): Promise<T | ErrorResponse> {
        return apiClient({
            type: "delete",
            service: "profile",
            uri: "/" + id,
        });
    }
}

export default new AccountService();
