import { createContext, useContext } from "react";

type ProfileContextType = {
    profile: UserProfile | null;
    isLoaded: boolean;
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

export type Address = {
    id: number;
    street: string;
    pinCode: string;
    state: string;
    country: string;
    deleted: boolean;
};

export const ProfileContext = createContext<ProfileContextType | null>(null);

export default function useProfile() {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error(
            "useProfile must be used inside ProfileContextProvider",
        );
    }
    return context;
}
