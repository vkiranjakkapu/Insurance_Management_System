import { createContext, useContext } from "react";
import type { Address } from "../services/AccountService";
import type { LoginRequest } from "../services/AuthService";

export type Principal = {
    id: number;
    name: string;
    email: string;
    roles: string[];
    accessToken: string;
    refreshToken: string;
    isLoggedIn: boolean;
};

export type UserProfile = {
    id: number;
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: Address;
    dob: string;
};

export type Authentication = {
    principal: Principal;
    profile: UserProfile | null;
    authenticate: (user: LoginRequest) => Promise<string>;
    logout: () => void;
    refresh: () => void;
    tokenLogin: () => void;
    getHomeRoute: (routes: string[]) => string;
};

export const AuthContext = createContext<Authentication | null>(null);

export default function usePrincipal() {
    const context = useContext(AuthContext);
    if (context == null) throw new Error("AuthContext Null");
    return context;
}
