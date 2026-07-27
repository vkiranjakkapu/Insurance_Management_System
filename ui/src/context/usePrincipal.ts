import { createContext, useContext } from "react";
import type { LoginRequest, LoginResponse } from "../services/AuthService";
import type { ErrorResponse } from "../api/api";

export type Principal = {
    id: number;
    name: string;
    email: string;
    roles: string[];
    accessToken: string;
    refreshToken: string;
};

export const AuthStatus = {
    INITIALIZING: "INITIALIZING",
    AUTHENTICATED: "AUTHENTICATED",
    UNAUTHENTICATED: "UNAUTHENTICATED",
} as const;
export type AuthStatus = (typeof AuthStatus)[keyof typeof AuthStatus];

export type Authentication = {
    principal: Principal;
    status: AuthStatus;
    isLoggedIn: () => boolean;
    authenticate: (
        user: LoginRequest,
    ) => Promise<ErrorResponse | LoginResponse | undefined>;
    logout: () => void;
    refresh: () => void;
    tokenLogin: () => void;
    getHomeRoute: (routes: string[], uri?: string) => string;
};

export const AuthContext = createContext<Authentication | null>(null);

export default function usePrincipal() {
    const context = useContext(AuthContext);
    if (context == null) throw new Error("AuthContext Null");
    return context;
}
