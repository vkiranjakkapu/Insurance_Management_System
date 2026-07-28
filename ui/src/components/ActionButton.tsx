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
    unsetClass?: boolean;
    iconAfter?: boolean;
    onClick: () => void;
}
export interface WithParamActionButtonProps extends Omit<
    ActionButtonProps,
    "onClick"
> {
    onClick: (id: number) => void;
}

export default function ActionButton({
    text,
    icon: Icon,
    iconAfter,
    className,
    unsetClass,
    onClick,
    ...props
}: ActionButtonProps) {
    return (
        <button
            onClick={() => onClick()}
            className={
                unsetClass
                    ? className && ""
                    : `text-sm font-medium p-1.5 text-white shadow-xs dark:text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:z-10 focus:ring-2 focus:ring-indigo-500/40 cursor-pointer transition-colors dark:disabled:opacity-40 disabled:opacity-80 disabled:cursor-not-allowed ${className}`
            }
            {...props}
        >
            <span className="flex gap-1.5 items-center cursor-pointer">
                {Icon && !iconAfter && <Icon className="size-4" />}
                {text && <span>{text}</span>}
                {Icon && iconAfter && <Icon className="size-4" />}
            </span>
        </button>
    );
}
