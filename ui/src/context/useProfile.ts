import { createContext, useContext } from "react";

type ProfileContextType = {
    profile: UserProfile | null;
    isLoaded: boolean;
};

export const UserGender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
    NON_DISCLOSED: "NON_DISCLOSED",
} as const;
export type UserGender = (typeof UserGender)[keyof typeof UserGender];

export type UserProfile = {
    id: string;
    email: string;
    name: string;
    gender: UserGender;
    firstName: string;
    lastName: string;
    phone: string;
    address: Address;
    dob: string;
    roles: string[];
};

export type Address = {
    id: number;
    street: string;
    city: string;
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
