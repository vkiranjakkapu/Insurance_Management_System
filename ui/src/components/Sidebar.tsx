import {
    useEffect,
    useState,
    type ForwardRefExoticComponent,
    type JSX,
    type PropsWithoutRef,
    type ReactNode,
    type SVGProps,
} from "react";

import ProfileIcon from "../assets/undraw_finance-guy-avatar_vhop.svg";
import Icon from "/icon.png";

// Import the outline variants (24x24) from Heroicons v2
import {
    ArrowLeftEndOnRectangleIcon,
    Bars3Icon,
    Cog6ToothIcon,
    InboxArrowDownIcon,
    MoonIcon,
    PresentationChartLineIcon,
    SunIcon,
    UsersIcon,
    WalletIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import usePrincipal from "../context/usePrincipal";
import useProfile from "../context/useProfile";
import { RoutePaths } from "../routes/RoutePaths";

interface SidebarLayoutProps {
    children?: ReactNode;
}

interface NavItem {
    label: string;
    route: string;
    // Type definition for Heroicons functional components
    icon: ForwardRefExoticComponent<
        PropsWithoutRef<SVGProps<SVGSVGElement>> & {
            title?: string;
            titleId?: string;
        }
    >;
    active: boolean;
    roles: string[];
}

export default function Sidebar({ children }: SidebarLayoutProps): JSX.Element {
    const { principal, logout } = usePrincipal();
    const { profile } = useProfile();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return (
                document.documentElement.classList.contains("dark") ||
                localStorage.getItem("theme") === "dark"
            );
        }
        return true;
    });

    // Sync state changes with the DOM root class
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    const toggleTheme = (): void => {
        setIsDarkMode((prev) => !prev);
    };

    const navPaths: NavItem[] = [
        {
            label: "Dashboard",
            route: RoutePaths.DASHBOARD,
            icon: PresentationChartLineIcon,
            active: true,
            roles: ["ADMIN", "AGENT", "CUSTOMER"],
        },
        {
            label: "Policies",
            route: RoutePaths.POLICIES,
            icon: WalletIcon,
            active: false,
            roles: ["ADMIN", "AGENT", "CUSTOMER"],
        },
        {
            label: "Subscriptions",
            route: RoutePaths.SUBSCIPRTIONS,
            icon: InboxArrowDownIcon,
            active: false,
            roles: ["ADMIN", "AGENT", "CUSTOMER"],
        },
        {
            label: "Claims",
            route: RoutePaths.CLAIMS,
            icon: InboxArrowDownIcon,
            active: false,
            roles: ["ADMIN", "AGENT", "CUSTOMER"],
        },
        {
            label: "Customers",
            route: RoutePaths.CUSTOMERS,
            icon: UsersIcon,
            active: false,
            roles: ["AGENT"],
        },
        {
            label: "Personnel",
            route: RoutePaths.CUSTOMERS,
            icon: UsersIcon,
            active: false,
            roles: ["ADMIN"],
        },
        {
            label: "Settings",
            route: RoutePaths.SYSTEM_SETTINGS,
            icon: Cog6ToothIcon,
            active: false,
            roles: [],
        },
    ];

    function loadPage(route: string) {
        navigate(route);
    }

    return (
        <div className="flex h-screen w-full overflow-hidden font-sans bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* MOBILE SIDEBAR OVERLAY */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* SIDEBAR SIDE PANEL */}
            <aside
                className={`
        fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r p-4 transition-transform duration-300 ease-in-out
        border-gray-200 bg-white text-gray-700
        dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300
        md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
            >
                {/* Header Brand Info */}
                <div className="flex h-12 items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <img
                            src={Icon}
                            alt="IMS"
                            width="40px"
                            className="rounded-sm drop-shadow-sm outline-1 outline-offset-2 outline-indigo-500"
                        />
                        <span className="text-lg font-semibold tracking-wide text-gray-900 dark:text-white">
                            IMS
                        </span>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 md:hidden"
                        aria-label="Close menu"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Core Navigation Items Stack */}
                <nav className="mt-6 flex-1 space-y-1">
                    <p className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        Workspace
                    </p>
                    {navPaths.map((item, idx) => {
                        const IconComponent = item.icon;
                        const isActive =
                            location.pathname === item.route ||
                            location.pathname.startsWith(`${item.route}/`);

                        if (!item.roles.includes(principal.roles[0])) {
                            return;
                        }

                        return (
                            <button
                                key={idx}
                                aria-label={item.label}
                                onClick={() => loadPage(item.route)}
                                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group
                  ${
                      isActive
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-600/10 dark:text-indigo-400"
                          : "hover:bg-gray-100 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100"
                  }
                `}
                            >
                                <IconComponent
                                    className={`h-5 w-5 transition-colors ${
                                        isActive
                                            ? "text-indigo-600 dark:text-indigo-400"
                                            : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                                    }`}
                                />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom Controls / Profile Meta Panel */}
                <div className="mt-auto border-t border-gray-200 pt-4 dark:border-gray-800 space-y-3">
                    {/* Theme Toggle Utility */}
                    <button
                        onClick={toggleTheme}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            {isDarkMode ? (
                                <SunIcon className="h-5 w-5" />
                            ) : (
                                <MoonIcon className="h-5 w-5" />
                            )}
                            <span>
                                {isDarkMode ? "Light Mode" : "Dark Mode"}
                            </span>
                        </div>
                        <span className="text-xs uppercase bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400 font-bold">
                            Toggle
                        </span>
                    </button>

                    {/* Profile Summary Slot */}
                    <div
                        className={`flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-800 transition-colors duration-100 
                                ${location.pathname == RoutePaths.PROFILE ? "bg-slate-200 dark:bg-slate-800/80" : ""}`}
                    >
                        <div
                            className="flex items-center gap-3 min-w-0"
                            onClick={() => {
                                navigate(RoutePaths.PROFILE);
                            }}
                        >
                            <img
                                src={ProfileIcon}
                                alt="Avatar"
                                className="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-gray-800"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-200">
                                    {profile?.name ?? "Loading..."}
                                </p>
                                <p className="truncate text-xs text-gray-400 dark:text-gray-500">
                                    {profile?.email ?? ""}
                                </p>
                            </div>
                        </div>
                        <button
                            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                            aria-label="Log out"
                            onClick={() => logout()}
                        >
                            <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* RIGHT VIEWPORT VIEW CANVAS */}
            <div className="flex flex-1 flex-col md:pl-64 h-full w-full">
                {/* Top Sticky Header for Mobile */}
                <header className="flex h-16 items-center justify-between border-b px-4 md:hidden border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                    <img
                        src={Icon}
                        alt="IMS"
                        width="40px"
                        className="rounded-sm drop-shadow-sm outline-1 outline-offset-2 outline-indigo-500"
                    />
                    <button
                        onClick={() => setIsOpen(true)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900 focus:outline-none"
                        aria-label="Open menu"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                </header>

                {/* Main Context Canvas View */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children || (
                        <>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Dashboard Workspace
                            </h1>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
