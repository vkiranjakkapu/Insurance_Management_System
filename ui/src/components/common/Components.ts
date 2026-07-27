import type {
    ForwardRefExoticComponent,
    PropsWithoutRef,
    SVGProps,
} from "react";

export interface ActionButton {
    text: string;
    icon: ForwardRefExoticComponent<
        PropsWithoutRef<SVGProps<SVGSVGElement>> & {
            title?: string;
            titleId?: string;
        }
    >;
    action: () => void;
}

export interface ParamButton extends Omit<ActionButton, "action"> {
    action: (id: number) => void;
}

export type UserCardData = {
    id: number;
    dp: string;
    name: string;
    email: string;
    phone: string;
    actionButtons: ParamButton[];
};

export type CustomTable<T extends object> = {
    title: string;
    description: string;
    actionButtons?: ActionButton[];
    tableData: CustomTableData<T>;
};

export type CustomTableData<T extends object> = {
    headers: (keyof T | string)[];
    pagination?: boolean;
    perPage?: number;
    body: T[];
    footer?: T[];
};
