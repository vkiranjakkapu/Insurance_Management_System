import {
    CameraIcon,
    CheckCircleIcon,
    LockClosedIcon,
} from "@heroicons/react/24/outline";
import type { SubmitEvent } from "react";
import ProfileIcon from "../../assets/undraw_finance-guy-avatar_vhop.svg";
import useProfile from "../../context/useProfile";
import DashboardLayout from "../../components/DashboardLayout";
import ActionButton from "../../components/ActionButton";

export default function ProfilePage() {
    const { profile } = useProfile();

    function updateProfile(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
    }

    function changePassword(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
    }

    return (
        <>
            <DashboardLayout title="Profile" description="Edit Your Profile">
                <div>
                    <form
                        onSubmit={updateProfile}
                        className="w-full shadow-sm dark:bg-gray-800/50 border border-slate-200 dark:border-slate-800 rounded-lg"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2 md:p-4">
                            <div className="col-span-full pb-3 border-b border-b-slate-200 dark:border-b-gray-600 mb-3">
                                <h1>Edit Details</h1>
                            </div>
                            <div className="text-slate-800 dark:text-white capitalize">
                                <label htmlFor="email">email:</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={profile?.email}
                                    className="shadow-sm border bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-700 p-2 w-full rounded-lg cursor-not-allowed"
                                    id={profile?.email}
                                    disabled
                                />
                            </div>
                            <div className="row-span-2 flex items-center-justify-center p-3">
                                <div className="rounded-full size-40 relative overflow-hidden mx-auto">
                                    <img
                                        src={ProfileIcon}
                                        alt="Profile Icon"
                                        className="rounded-full outline outline-slate-300 outline-offset-1 dark:outline-gray-700"
                                    />
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full bg-white/20 p-2 flex items-center justify-center">
                                        <ActionButton
                                            onClick={() => {}}
                                            icon={CameraIcon}
                                            // unsetClass={true}
                                            className="size-10 rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="text-slate-800 dark:text-white capitalize">
                                <label htmlFor="name">name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profile?.name}
                                    className="shadow-sm border border-slate-200 dark:border-slate-700 p-2 w-full rounded-lg"
                                    id={profile?.name}
                                />
                            </div>
                            <div className="text-slate-800 dark:text-white capitalize">
                                <label htmlFor="firstName">firstName:</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={profile?.firstName}
                                    className="shadow-sm border border-slate-200 dark:border-slate-700 p-2 w-full rounded-lg"
                                    id={profile?.firstName}
                                />
                            </div>
                            <div className="text-slate-800 dark:text-white capitalize">
                                <label htmlFor="lastName">lastName:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={profile?.lastName}
                                    className="shadow-sm border border-slate-200 dark:border-slate-700 p-2 w-full rounded-lg"
                                    id={profile?.lastName}
                                />
                            </div>
                            <div className="col-span-full flex justify-end">
                                <ActionButton
                                    icon={CheckCircleIcon}
                                    text="Update"
                                    type="submit"
                                    onClick={() => {}}
                                    className="rounded-lg outline outline-offset-1 outline-indigo-600"
                                />
                            </div>
                        </div>
                    </form>
                    <form
                        onSubmit={changePassword}
                        className="w-full shadow-sm dark:bg-gray-800/50 border border-slate-200 dark:border-slate-800 rounded-lg mt-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2 md:p-4">
                            <div className="col-span-full pb-3 border-b border-b-slate-200 dark:border-b-gray-600 mb-3">
                                <h1>Edit Password</h1>
                            </div>
                            <div className="text-slate-800 dark:text-white capitalize">
                                <label htmlFor="oldPassword">
                                    Old Password
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Old Password"
                                    className="shadow-sm border border-slate-200 dark:border-slate-700 p-2 w-full rounded-lg"
                                    id="oldPassword"
                                />
                            </div>
                            <div></div>
                            <div className="text-slate-800 dark:text-white capitalize">
                                <label htmlFor="newPassword">
                                    New Password
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="New Password"
                                    className="shadow-sm border border-slate-200 dark:border-slate-700 p-2 w-full rounded-lg"
                                    id="newPassword"
                                />
                            </div>
                            <div className="text-slate-800 dark:text-white capitalize">
                                <label htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Confirm Password"
                                    className="shadow-sm border border-slate-200 dark:border-slate-700 p-2 w-full rounded-lg"
                                    id="confirmPassword"
                                />
                            </div>
                            <div className="col-span-full flex justify-end">
                                <ActionButton
                                    icon={LockClosedIcon}
                                    text="Change"
                                    type="submit"
                                    onClick={() => {}}
                                    className="rounded-lg outline outline-offset-1 outline-indigo-600"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        </>
    );
}
