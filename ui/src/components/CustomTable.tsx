import {
    ChevronRightIcon,
    ClockIcon,
    ExclamationCircleIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import type {
    ForwardRefExoticComponent,
    PropsWithoutRef,
    SVGProps,
} from "react";
import { PolicyStatus } from "../pages/policies/Policy";

export type TableData<T extends object> = {
    title: string;
    description: string;
    actionButtons: ActionButton[];
    data: TableContent<T>;
};

export type TableContent<T extends object> = {
    headers: (keyof T | string)[];
    body: T[];
    footer?: T[];
};

export type ActionButton = {
    text: string;
    icon: ForwardRefExoticComponent<
        PropsWithoutRef<SVGProps<SVGSVGElement>> & {
            title?: string;
            titleId?: string;
        }
    >;
    action: () => void;
};

interface CustomTableProps<T extends object> {
    table: TableData<T>;
    onActionClick?: (item: T) => void;
}

export default function CustomTable<T extends object>({
    table,
    onActionClick,
}: CustomTableProps<T>) {
    if (!table) return null;

    // Helper to render badges automatically if a column value matches a status
    const renderCellValue = (value: unknown) => {
        if (value === PolicyStatus.Active) {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <ShieldCheckIcon className="size-3.5 text-emerald-500" />
                    Active
                </span>
            );
        }
        if (value === PolicyStatus.Pending) {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                    <ClockIcon className="size-3.5 text-amber-500" />
                    Pending
                </span>
            );
        }
        if (value === PolicyStatus.Override) {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-700 dark:text-rose-400">
                    <ExclamationCircleIcon className="size-3.5 text-rose-500" />
                    Overdue
                </span>
            );
        }

        return String(value ?? "");
    };
    return (
        <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {table.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {table.description}
                    </p>
                </div>

                {table.actionButtons && (
                    <div
                        className="inline-flex rounded-lg shadow-sm outline-1 outline-offset-2 outline-indigo-500"
                        role="group"
                    >
                        {table.actionButtons.map((btn, idx) => {
                            const isFirst = idx === 0;
                            const isLast =
                                idx === table.actionButtons!.length - 1;
                            const roundedClass =
                                isFirst && isLast
                                    ? "rounded-lg"
                                    : isFirst
                                      ? "rounded-s-lg"
                                      : isLast
                                        ? "rounded-e-lg"
                                        : "";
                            return (
                                <button
                                    type="button"
                                    className={`text-sm font-medium px-3.5 py-2 text-white shadow-xs dark:text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:z-10 focus:ring-2 focus:ring-indigo-500/40 cursor-pointer transition-colors
                            ${roundedClass}`}
                                >
                                    <div className="flex items-center gap-1">
                                        <btn.icon className="size-5 my-auto" />
                                        {btn.text}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Table Body */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                    {table.data.headers && (
                        <thead className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                            <tr>
                                {table.data.headers.map((headerKey) => {
                                    return (
                                        <th
                                            key={String(headerKey)}
                                            scope="col"
                                            className="px-6 py-3.5"
                                        >
                                            {String(headerKey)}
                                        </th>
                                    );
                                })}
                                {onActionClick && (
                                    <th
                                        scope="col"
                                        className="px-6 py-3.5 text-right"
                                    >
                                        Action
                                    </th>
                                )}
                            </tr>
                        </thead>
                    )}
                    <tbody className="divide-y divide-slate-200 transition-colors dark:divide-slate-800">
                        {table.data.body &&
                            table.data.body.map((item, idx) => (
                                <tr
                                    key={idx}
                                    className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/40"
                                >
                                    {/* Dynamically Map Object Keys to Table Cells */}
                                    {table.data.headers.map((headerKey) => {
                                        const keyName = String(
                                            headerKey,
                                        ) as keyof T;
                                        const cellValue = item[keyName];

                                        return (
                                            <td
                                                key={String(headerKey)}
                                                className="px-6 py-4"
                                            >
                                                {renderCellValue(cellValue)}
                                            </td>
                                        );
                                    })}
                                    {/* Optional Action Column */}
                                    {onActionClick && (
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onActionClick(item)
                                                }
                                                className={`inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors`}
                                            >
                                                <span className="flex gap-1.5 items-center cursor-pointer">
                                                    <span>Manage</span>
                                                    <ChevronRightIcon className="size-4" />
                                                </span>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                    </tbody>
                    {table.data.footer && (
                        <footer>
                            {table.data.footer.map((tr) => {
                                return <tr>{JSON.stringify(tr)}</tr>;
                            })}
                        </footer>
                    )}
                </table>
            </div>
        </div>
    );
}
