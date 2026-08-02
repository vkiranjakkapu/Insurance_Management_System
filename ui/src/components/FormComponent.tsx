import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    PlusCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import type {
    ForwardRefExoticComponent,
    PropsWithoutRef,
    ReactNode,
    SubmitEvent,
    SVGProps,
} from "react";
import ActionButton from "./ActionButton";

export type FormErrorsProps = {
    type: "success" | "error";
    errors: string[];
};

export type FormProps = {
    children: ReactNode;
    formErrors: { type: string; errors: string[] } | null;
    actionText: string;
    icon?: ForwardRefExoticComponent<
        PropsWithoutRef<SVGProps<SVGSVGElement>> & {
            title?: string;
            titleId?: string;
        }
    >;
    showFooter?: boolean;
    secondsLeft?: number;
    closeModal?: () => void;
    handleSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
};
export default function FormComponent({
    children,
    formErrors,
    actionText,
    icon: Icon,
    secondsLeft,
    showFooter,
    closeModal,
    handleSubmit,
}: FormProps) {
    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 px-2 grid grid-cols-1 md:grid-cols-3 gap-3"
        >
            {formErrors && formErrors?.errors.length > 0 && (
                <div
                    className={`p-2.5 col-span-full flex flex-row gap-2 items-center dark:text-white text-sm rounded-lg 
                                ${
                                    formErrors.type == "success"
                                        ? " bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                        : " bg-rose-500/10 text-rose-700 dark:text-rose-400"
                                }`}
                >
                    {formErrors.type == "error" ? (
                        <ExclamationCircleIcon className={`text-rose-500 size-4`} />
                    ) : (
                        <CheckCircleIcon className="text-emerald-500 size-4" />
                    )}
                    <span>{formErrors.errors.join(", ")}</span>
                </div>
            )}
            {children}

            {/* Bottom Action Drawer buttons */}
            {showFooter && <div className="col-span-full py-2 flex items-center justify-end space-x-3 pt-4 mt-6 border-t border-slate-200 dark:border-slate-800">
                {closeModal && (
                    <ActionButton
                        text="Cancel"
                        onClick={closeModal}
                        icon={XMarkIcon}
                        unsetClass={true}
                        className="p-1.5 flex flex-row items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    />
                )}
                <ActionButton
                    text={`${secondsLeft && secondsLeft > 0 ? "Closing in " + secondsLeft + " S" : actionText} `}
                    onClick={() => {}}
                    icon={Icon ?? PlusCircleIcon}
                    // disabled={secondsLeft != 0}
                    className={`rounded-lg outline-1 outline-offset-1 outline-indigo-600`}
                />
            </div>}
        </form>
    );
}
