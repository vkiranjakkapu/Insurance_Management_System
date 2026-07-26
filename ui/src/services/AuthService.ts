import api from "../api/api";
import TokenStorage from "../storage/TokenStorage";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
}

export interface Response {
    data: object;
    status: number;
}

class AuthService {
    async login(request: LoginRequest): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>(
            "/api/auth/login",
            request,
        );

        if (response.status == 200) {
            TokenStorage.save(
                response.data.accessToken,
                response.data.refreshToken,
            );
        }

        return response.data;
    }

    async refresh(refreshToken: string): Promise<LoginResponse> {
        try {
            const response = await api.post<LoginResponse>(
                "/api/auth/refresh",
                {
                    refreshToken,
                },
            );

            if (response.status == 200) {
                TokenStorage.save(
                    response.data.accessToken,
                    response.data.refreshToken,
                );
            }

            return response.data;
        } catch {
            throw new Error("Refresh Failed");
        }
    }

    async logout(refreshToken: string): Promise<number> {
        const response = await api.post("/api/auth/logout", { refreshToken });

        if (response.status == 200) {
            TokenStorage.clear();
        }
        return response.status;
    }
}

export default new AuthService();
