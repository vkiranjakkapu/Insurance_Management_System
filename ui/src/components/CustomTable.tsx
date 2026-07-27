import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ClockIcon,
    ExclamationCircleIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import { PolicyStatus } from "../pages/policies/Policy";
import { usePagination } from "./ClientPagination";
import type { CustomTable } from "./common/Components";
import { ThemedSearchInput } from "./ThemedSearchInput";

interface CustomTableProps<T extends object> {
    table: CustomTable<T>;
    handleSearch?: (input: string) => void;
    onActionClick?: (item: T) => void;
    loadMore?: () => void;
}

export default function CustomTableComponent<T extends object>({
    table,
    handleSearch,
    onActionClick,
}: CustomTableProps<T>) {
    const { title, description, tableData, actionButtons } = table;
    const { headers, body, pagination, perPage, footer } = tableData;
    let placeHolder: string = "";
    if (body.length != 0) {
        placeHolder += `${String(headers[0])}:${String(body[0][headers[0] as keyof T])},val2; `;
        placeHolder += `${String(headers[1])}:${String(body[0][headers[1] as keyof T])}`;
    } else {
        placeHolder += "Search";
    }

    const {
        currentPage,
        totalPages,
        currentItems,
        goToNextPage,
        goToPrevPage,
    } = usePagination<T>(body, pagination ? perPage : body.length);

    if (!table) return null;

    // Helper to render badges automatically if a column value matches a status
    const renderCellValue = (value: unknown) => {
        if (value === PolicyStatus.ACTIVE) {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <ShieldCheckIcon className="size-3.5 text-emerald-500" />
                    Active
                </span>
            );
        }
        if (value === PolicyStatus.PENDING_APPROVAL) {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                    <ClockIcon className="size-3.5 text-amber-500" />
                    {PolicyStatus.PENDING_APPROVAL}
                </span>
            );
        }
        if (value === PolicyStatus.OVERRIDE) {
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
            <div className="flex flex-col items-start gap-3 justify-start border-b border-slate-200 px-6 py-4 dark:border-slate-800 md:flex-row md:justify-between md:items-center">
                <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>

                {actionButtons?.length != 0 && (
                    <div
                        className="inline-flex flex-col rounded-lg shadow-sm outline-1 outline-offset-2 outline-indigo-500 md:flex-row"
                        role="group"
                    >
                        {actionButtons?.map((btn, idx) => {
                            const isFirst = idx === 0;
                            const isLast = idx === actionButtons!.length - 1;
                            const roundedClass =
                                isFirst && isLast
                                    ? "rounded-lg"
                                    : isFirst
                                      ? "rounded-t-lg md:rounded-s-lg md:rounded-tr-none"
                                      : isLast
                                        ? "rounded-b-lg md:rounded-e-lg md:rounded-bl-none"
                                        : "";
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={btn.action}
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
            {/* Search and Pagination section */}
            {(pagination || handleSearch) && (
                <div className="px-6 py-4 flex gap-2 flex-col items-start justify-between border-b border-slate-200 md:flex-row md:items-center">
                    {handleSearch && (
                        <ThemedSearchInput
                            placeholder={placeHolder}
                            onChange={(e) => handleSearch(e.target.value)}
                            onClear={() => handleSearch("")}
                        />
                    )}
                    {pagination && (
                        <div className={`w-full md:w-auto`}>
                            <div className="flex items-center gap-3 text-end">
                                <span className="text-sm text-gray-800 dark:text-white">
                                    Showing page {currentPage} of {totalPages}{" "}
                                    pages
                                </span>
                                <div
                                    className="inline-flex flex-col rounded-lg shadow-sm outline-1 outline-offset-2 outline-indigo-500 md:flex-row"
                                    role="group"
                                >
                                    <button
                                        disabled={currentPage == 1}
                                        onClick={() => {
                                            goToPrevPage();
                                        }}
                                        className="p-1.5 text-sm font-medium text-white shadow-xs dark:text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:z-10 focus:ring-2 focus:ring-indigo-500/40 cursor-pointer transition-colors dark:disabled:opacity-40 disabled:opacity-80 disabled:cursor-not-allowed rounded-s-lg"
                                    >
                                        <ChevronLeftIcon className="size-5" />
                                    </button>
                                    <button
                                        disabled={currentPage == totalPages}
                                        onClick={() => {
                                            goToNextPage();
                                        }}
                                        className="p-1.5 text-sm font-medium text-white shadow-xs dark:text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:z-10 focus:ring-2 focus:ring-indigo-500/40 cursor-pointer transition-colors dark:disabled:opacity-40 disabled:opacity-80 disabled:cursor-not-allowed rounded-e-lg"
                                    >
                                        <ChevronRightIcon className="size-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {/* Table Body */}
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
                        {currentItems &&
                            currentItems.map((item, idx) => (
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
                        {currentItems.length == 0 && (
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
        </div>
    );
}
