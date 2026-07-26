import { useEffect, useState, type ReactNode } from "react";
import { RoutePaths } from "../routes/RoutePaths";
import AccountService from "../services/AccountService";
import AuthService, { type LoginRequest } from "../services/AuthService";
import TokenStorage from "../storage/TokenStorage";
import { decodedToken } from "../utils/JwtUtils";
import { AuthContext, type Principal, type UserProfile } from "./usePrincipal";

const principal: Principal = {
    id: 0,
    name: "",
    email: "",
    roles: [],
    accessToken: "",
    refreshToken: "",
    isLoggedIn: false,
};

type AuthContextProviderProps = {
    children: ReactNode;
};

export default function AuthContextProvider({
    children,
}: AuthContextProviderProps) {
    console.log("AuthContext");

    const [authContext, setAuthContext] = useState<Principal>(principal);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        initializeAuthentication();
    }, []);

    async function initializeAuthentication() {
        const refreshToken = TokenStorage.getRefreshToken();

        if (!refreshToken) {
            return;
        }

        try {
            const response = await AuthService.refresh(refreshToken);
            const jwt = decodedToken(response.accessToken);

            const userProfile = await AccountService.getMyProfile();
            setProfile(() => ({
                ...userProfile,
                name: `${userProfile.firstName} ${userProfile.lastName}`,
            }));

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
        } catch (error) {
            console.error(error);
            TokenStorage.clear();
            setAuthContext(principal);
        }
    }

    async function loadProfile() {
        const response = await AccountService.getMyProfile();
        const userProfile: UserProfile = {
            ...response,
            name: `${response.firstName} ${response.lastName}`,
        };
        setProfile(userProfile);
    }

    async function authenticate(credentials: LoginRequest): Promise<string> {
        try {
            const response = await AuthService.login(credentials);

            const jwt = decodedToken(response.accessToken);

            TokenStorage.save(response.accessToken, response.refreshToken);
            loadProfile();

            setAuthContext((prev) => ({
                ...prev,
                email: jwt.sub,
                roles: jwt.roles,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                isLoggedIn: true,
            }));

            return getHomeRoute(jwt.roles);
        } catch (error) {
            console.error(error);
            TokenStorage.clear();
            setAuthContext(principal);
            return getHomeRoute([]);
        }
    }

    async function logout() {
        const status = await AuthService.logout(authContext.refreshToken);
        if (status == 204) {
            TokenStorage.clear();
            setProfile(null);
            setAuthContext((prev) => ({
                ...prev,
                isLoggedIn: false,
            }));
        }
    }

    async function refresh() {
        const response = await AuthService.refresh(authContext.accessToken);
        TokenStorage.save(response.accessToken, response.refreshToken);
        setAuthContext((prev) => ({
            ...prev,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isLoggedIn: true,
        }));
    }

    function getHomeRoute(roles: string[]) {
        if (roles.includes("ADMIN")) {
            return RoutePaths.DASHBOARD;
        }

        if (roles.includes("AGENT")) {
            return RoutePaths.AGENT;
        }

        if (roles.includes("CUSTOMER")) {
            return RoutePaths.POLICIES;
        }

        return RoutePaths.HOME;
    }

    return (
        <AuthContext
            value={{
                principal: authContext,
                profile,
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
