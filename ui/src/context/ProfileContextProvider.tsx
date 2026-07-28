import { useEffect, useState, type ReactNode } from "react";
import { ProfileContext, type UserProfile } from "./useProfile";
import usePrincipal, { AuthStatus } from "./usePrincipal";
import AccountService from "../services/AccountService";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "../api/api";

type ProfileContextProps = {
    children: ReactNode;
};

export default function ProfileContextProvider({
    children,
}: ProfileContextProps) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [profileLoaded, isLoaded] = useState<boolean>(false);
    const authContext = usePrincipal();

    useEffect(() => {
        async function loadProfile() {
            if (authContext.status != AuthStatus.AUTHENTICATED) return;
            try {
                const userProfile = await AccountService.getMyProfile();
                setProfile(() => ({
                    ...userProfile,
                    name: `${userProfile.firstName} ${userProfile.lastName}`,
                }));
                isLoaded(true);
            } catch (error) {
                const axiosError = error as AxiosError<ErrorResponse>;
                isLoaded(false);
                console.log(axiosError.response?.data);
            }
        }

        loadProfile();
    }, [authContext.status]);

    return (
        <ProfileContext value={{ profile, isLoaded: profileLoaded }}>
            {children}
        </ProfileContext>
    );
}
