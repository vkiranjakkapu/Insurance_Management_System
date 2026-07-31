import api from "../api/api";
import { AppConfig } from "../config/AppConfig";
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
}

export default new AccountService();
