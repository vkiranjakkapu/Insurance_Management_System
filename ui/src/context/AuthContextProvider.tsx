import { useEffect, useState, type ReactNode } from "react";
import { RoutePaths } from "../routes/RoutePaths";
import AuthService, {
    type LoginRequest,
    type LoginResponse,
} from "../services/AuthService";
import TokenStorage from "../storage/TokenStorage";
import { decodedToken } from "../utils/JwtUtils";
import { AuthContext, AuthStatus, type Principal } from "./usePrincipal";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "../api/api";

const principal: Principal = {
    id: 0,
    name: "",
    email: "",
    roles: [],
    accessToken: "",
    refreshToken: "",
};

type AuthContextProviderProps = {
    children: ReactNode;
};

export default function AuthContextProvider({
    children,
}: AuthContextProviderProps) {
    const [authContext, setAuthContext] = useState<Principal>(principal);
    const [authStatus, setAuthStatus] = useState<AuthStatus>(
        AuthStatus.INITIALIZING,
    );

    useEffect(() => {
        initializeAuthentication();
    }, []);

    async function initializeAuthentication() {
        const refreshToken = TokenStorage.getRefreshToken();

        if (!refreshToken) {
            setAuthStatus(AuthStatus.UNAUTHENTICATED);
            return;
        }
        setAuthStatus(AuthStatus.INITIALIZING);

        try {
            const response = await AuthService.refresh(refreshToken);
            const jwt = decodedToken(response.accessToken);

            TokenStorage.save(response.accessToken, response.refreshToken);

            setAuthContext((prev) => ({
                ...prev,
                id: jwt.uid,
                name: jwt.name,
                email: jwt.sub,
                roles: jwt.roles,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                isLoggedIn: true,
            }));
            setAuthStatus(AuthStatus.AUTHENTICATED);
        } catch (error) {
            console.error(error);
            TokenStorage.clear();
            setAuthContext(principal);
            setAuthStatus(AuthStatus.UNAUTHENTICATED);
        }
    }

    async function authenticate(
        credentials: LoginRequest,
    ): Promise<ErrorResponse | LoginResponse | undefined> {
        setAuthStatus(AuthStatus.INITIALIZING);
        try {
            const response = await AuthService.login(credentials);

            const jwt = decodedToken(response.accessToken);

            TokenStorage.save(response.accessToken, response.refreshToken);

            setAuthContext((prev) => ({
                ...prev,
                email: jwt.sub,
                roles: jwt.roles,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                isLoggedIn: true,
            }));

            setAuthStatus(AuthStatus.AUTHENTICATED);
            return response;
        } catch (axiosError) {
            const error = axiosError as AxiosError<ErrorResponse>;
            TokenStorage.clear();
            setAuthContext(principal);
            setAuthStatus(AuthStatus.UNAUTHENTICATED);
            return error.response && error.response?.data;
        }
    }

    async function logout() {
        const status = await AuthService.logout(authContext.refreshToken);
        if (status == 204) {
            TokenStorage.clear();
            setAuthContext(principal);
            setAuthStatus(AuthStatus.UNAUTHENTICATED);
        }
    }

    async function refresh() {
        setAuthStatus(AuthStatus.INITIALIZING);
        try {
            const response = await AuthService.refresh(authContext.accessToken);
            TokenStorage.save(response.accessToken, response.refreshToken);
            setAuthContext((prev) => ({
                ...prev,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                isLoggedIn: true,
            }));
            setAuthStatus(AuthStatus.AUTHENTICATED);
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            console.log(axiosError.response?.data);
            setAuthStatus(AuthStatus.UNAUTHENTICATED);
        }
    }

    function isLoggedIn() {
        return authStatus == AuthStatus.AUTHENTICATED;
    }

    function getHomeRoute(roles: string[], uri?: string) {
        if (roles.includes("ADMIN")) {
            return uri && uri != RoutePaths.HOME ? uri : RoutePaths.DASHBOARD;
        }

        if (roles.includes("AGENT")) {
            return uri && uri != RoutePaths.HOME ? uri : RoutePaths.AGENT;
        }

        if (roles.includes("CUSTOMER")) {
            return uri && uri != RoutePaths.HOME ? uri : RoutePaths.POLICIES;
        }

        return RoutePaths.HOME;
    }

    return (
        <AuthContext
            value={{
                principal: authContext,
                status: authStatus,
                isLoggedIn,
                authenticate,
                logout,
                refresh,
                tokenLogin: initializeAuthentication,
                getHomeRoute,
            }}
        >
            {children}
        </AuthContext>
    );
}
