import type {
    ButtonHTMLAttributes,
    ForwardRefExoticComponent,
    PropsWithoutRef,
    SVGProps,
} from "react";

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    icon?: ForwardRefExoticComponent<
        PropsWithoutRef<SVGProps<SVGSVGElement>> & {
            title?: string;
            titleId?: string;
        }
    >;
    className?: string;
    theme?: string;
    unsetClass?: boolean;
    iconAfter?: boolean;
    onClick: () => void;
}
export interface WithParamActionButtonProps extends Omit<
    ActionButtonProps,
    "onClick"
> {
    onClick: (id: string) => void;
}

export default function ActionButton({
    text,
    icon: Icon,
    iconAfter,
    theme,
    className,
    unsetClass = false,
    onClick,
    ...props
}: ActionButtonProps) {
    return (
        <button
            onClick={() => onClick()}
            className={
                unsetClass
                    ? (className ?? "")
                    : `flex flex-row gap-1.5 items-center justify-center text-sm font-medium p-1.5 text-white shadow-xs dark:text-white focus:z-10 focus:ring-2 cursor-pointer transition-colors dark:disabled:opacity-40 disabled:opacity-80 disabled:cursor-not-allowed ${theme ? "bg-" + theme + "-600 hover:bg-" + theme + "-700 dark:bg-" + theme + "-500 dark:hover:bg-" + theme + "-600 focus:ring-" + theme + "-500/40" : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:ring-indigo-500/40"} ${className}`
            }
            {...props}
        >
            {Icon && !iconAfter && <Icon className="size-4" />}
            {text && <span>{text}</span>}
            {Icon && iconAfter && <Icon className="size-4" />}
        </button>
    );
}
