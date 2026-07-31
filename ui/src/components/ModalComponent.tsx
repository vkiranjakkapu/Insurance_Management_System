import React, { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ActionButton from "./ActionButton";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    /** Optional styling configurations */
    maxWidthClass?:
        | "max-w-md"
        | "max-w-lg"
        | "max-w-xl"
        | "max-w-2xl"
        | "max-w-4xl";
}

export default function ModalComponent({
    isOpen,
    onClose,
    title,
    children,
    maxWidthClass = "max-w-lg",
}: ModalProps) {
    // Close modal when pressing the Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            // Prevent background page scrolling when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop Blur Overlay */}
            <div
                className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Body Container */}
            <div
                className={`relative w-full ${maxWidthClass} transform rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 text-left shadow-2xl transition-all duration-200 ease-out`}
            >
                {/* Header Block */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-50">
                        {title}
                    </h3>
                    <ActionButton
                        type="button"
                        onClick={onClose}
                        icon={XMarkIcon}
                        unsetClass={true}
                        className="rounded-lg p-1 cursor-pointer text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                        aria-label="Close modal"
                    />
                </div>

                <div className="max-h-[70vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}
