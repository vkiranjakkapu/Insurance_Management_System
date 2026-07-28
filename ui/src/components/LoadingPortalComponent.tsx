import {
    useEffect,
    type ForwardRefExoticComponent,
    type PropsWithoutRef,
    type SVGProps,
} from "react";
import { createPortal } from "react-dom";
import Logo from "/icon.png";

interface LoadingPortalProps {
    isLoading: boolean;
    icon?: ForwardRefExoticComponent<
        PropsWithoutRef<SVGProps<SVGSVGElement>> & {
            title?: string;
            titleId?: string;
        }
    >;
    message?: string;
    subMessage?: string;
}

export default function LoadingPortalComponent({
    isLoading,
    icon: Icon,
    message = "Processing Request...",
    subMessage = "Please wait while we update your policy data.",
}: LoadingPortalProps) {
    // Prevent scroll when loader is active
    useEffect(() => {
        if (isLoading) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isLoading]);

    if (!isLoading) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            aria-busy="true"
            aria-live="polite"
        >
            <div className="relative flex w-full max-w-sm flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
                {/* Animated Brand Shield Icon & Spinner Ring */}
                <div className="relative flex items-center justify-center">
                    {/* Outer Pulsing Glow */}
                    <div className="absolute size-16 animate-ping rounded-full bg-indigo-500/20 dark:bg-indigo-400/20" />

                    {/* Rotating Spinner Border */}
                    <div className="size-16 animate-spin rounded-full border-4 border-slate-100 border-t-indigo-600 dark:border-slate-800 dark:border-t-indigo-400" />

                    {/* Center Brand Icon */}
                    <div className="absolute flex items-center justify-center">
                        {Icon ? (
                            <Icon className="size-7 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                            <img
                                src={Logo}
                                alt="IMS"
                                className="size-14 rounded-full outline-1 outline-indigo-500"
                            />
                        )}
                    </div>
                </div>

                {/* Dynamic Loading Text */}
                <div className="mt-5 space-y-1">
                    <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {message}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {subMessage}
                    </p>
                </div>

                {/* Subtle Progress Bar Animation */}
                <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full w-1/3 animate-pulse rounded-full bg-indigo-600 dark:bg-indigo-400" />
                </div>
            </div>
        </div>,
        document.body,
    );
}
