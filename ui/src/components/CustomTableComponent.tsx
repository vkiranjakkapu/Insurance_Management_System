import {
    ChevronRightIcon,
    ClockIcon,
    ExclamationCircleIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import DashboardLayout from "../pages/dashboard/Dashboard";
import ActionButton, { type ActionButtonProps } from "./ActionButton";
import { type UsePaginationReturn } from "./common/usePagination";
import { ClaimStatus } from "../pages/claims/Claims";

export type CustomTable<T extends object> = {
    title: string;
    description: string;
    actionButtons?: ActionButtonProps[];
    tableData: CustomTableData<T>;
};

export type CustomTableData<T extends object> = {
    headers: (keyof T | string)[];
    pagination?: boolean;
    perPage?: number;
    body: T[];
    footer?: T[];
};

interface CustomTableProps<T extends object> {
    title: string;
    description: string;
    actionButtons?: ActionButtonProps[];
    headers: (keyof T | string)[];
    pagination?: UsePaginationReturn<T>;
    perPage?: number;
    body: T[];
    footer?: T[];
    searchField?: {
        placeHolder?: string;
        matchInfo?: string;
        handleSearch: (input: string) => void;
    };
    onActionClick?: (item: T) => void;
}

export default function CustomTableComponent<T extends object>({
    title,
    description,
    actionButtons,
    searchField,
    pagination,
    headers,
    body,
    footer,
    onActionClick,
}: CustomTableProps<T>) {
    let placeHolder: string = "";
    if (body.length != 0) {
        placeHolder += `${String(headers[0])}:${String(body[0][headers[0] as keyof T])},val2; `;
        placeHolder += `${String(headers[1])}:${String(body[0][headers[1] as keyof T])}`;
    } else {
        placeHolder += "Search";
    }

    const tableBody: T[] = pagination ? pagination.currentItems : body;

    // Helper to render badges automatically if a column value matches a status
    const renderCellValue = (value: unknown) => {
        if (value === ClaimStatus.ACCEPTED) {
            return (
                <span className="capitalize inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <ShieldCheckIcon className="size-3.5 text-emerald-500" />
                    {ClaimStatus.ACCEPTED}
                </span>
            );
        }
        if (value === ClaimStatus.PENDING) {
            return (
                <span className="capitalize inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                    <ClockIcon className="size-3.5 text-amber-500" />
                    {ClaimStatus.PENDING}
                </span>
            );
        }
        if (value === ClaimStatus.REJECTED) {
            return (
                <span className="capitalize inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-700 dark:text-rose-400">
                    <ExclamationCircleIcon className="size-3.5 text-rose-500" />
                    {ClaimStatus.REJECTED}
                </span>
            );
        }

        return String(value ?? "");
    };
    return (
        <>
            <DashboardLayout
                title={title}
                description={description}
                searchField={
                    searchField
                        ? {
                              placeHolder,
                              matchInfo: searchField.matchInfo,
                              handleSearch: searchField.handleSearch,
                          }
                        : undefined
                }
                actionButtons={actionButtons}
                pagination={pagination ?? pagination}
            >
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                        {headers && (
                            <thead className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                                <tr>
                                    {headers.map((headerKey) => {
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
                            {tableBody &&
                                tableBody.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/40"
                                    >
                                        {/* Dynamically Map Object Keys to Table Cells */}
                                        {headers.map((headerKey) => {
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
                                                <ActionButton
                                                    onClick={() =>
                                                        onActionClick(item)
                                                    }
                                                    icon={ChevronRightIcon}
                                                    iconAfter={true}
                                                    text="Manage"
                                                    unsetClass={true}
                                                    className={`inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors`}
                                                />
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            {tableBody.length == 0 && (
                                <tr>
                                    <td
                                        colSpan={headers.length}
                                        className="px-6 py-4"
                                    >
                                        No Results for given search
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        {footer && (
                            <footer>
                                {footer.map((tr) => {
                                    return <tr>{JSON.stringify(tr)}</tr>;
                                })}
                            </footer>
                        )}
                    </table>
                </div>
            </DashboardLayout>
        </>
    );
}
