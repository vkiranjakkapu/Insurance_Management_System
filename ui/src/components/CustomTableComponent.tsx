import { ChevronRightIcon } from "@heroicons/react/24/outline";

import type { ChangeEvent, ReactNode } from "react";
import DashboardLayout from "./DashboardLayout";
import ActionButton, { type ActionButtonProps } from "./ActionButton";
import { type UsePaginationReturn } from "./common/usePagination";

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
    title?: string;
    description?: string;
    actionButtons?: ActionButtonProps[];
    selectOptions?: {
        selectedItems: T[];
        handleCheckbox: (e: ChangeEvent<HTMLInputElement>, item: T) => void;
    };
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
    dataFetchProgress?: boolean;
    renderCellValue?: (value: unknown) => ReactNode;
    onActionClick?: (item: T) => void;
}

export default function CustomTableComponent<T extends object>({
    title,
    description,
    actionButtons,
    searchField,
    selectOptions,
    pagination,
    headers,
    body,
    footer,
    dataFetchProgress,
    renderCellValue,
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

    return (
        <>
            <DashboardLayout
                title={title}
                description={description}
                dataFetchProgress={dataFetchProgress}
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
                    {headers.length != 0 && (
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                            {headers && (
                                <thead className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                                    <tr>
                                        {selectOptions && <th>Select</th>}
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
                                        {headers.length > 1 &&
                                            onActionClick && (
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
                                            {/* Optional Checkbox Action Column */}
                                            {selectOptions && (
                                                <td className="px-6 py-4 text-right">
                                                    <input
                                                        type="checkbox"
                                                        name="document"
                                                        id={`item-${idx}`}
                                                        className="me-2 cursor-pointer h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 disabled:bg-red-400"
                                                        // Bind change listener
                                                        onChange={(e) =>
                                                            selectOptions.handleCheckbox(
                                                                e,
                                                                item,
                                                            )
                                                        }
                                                        // Controlled checkbox: returns true if the number 1 is in our array
                                                        checked={selectOptions.selectedItems.includes(
                                                            item,
                                                        )}
                                                    />
                                                </td>
                                            )}
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
                                                        {renderCellValue
                                                            ? renderCellValue(
                                                                  cellValue,
                                                              )
                                                            : String(cellValue)}
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
                                {tableBody.length == 0 &&
                                    headers.length > 1 && (
                                        <tr>
                                            <td
                                                colSpan={headers.length}
                                                className="px-6 py-4"
                                            >
                                                No Records Available.
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
                    )}
                </div>
            </DashboardLayout>
        </>
    );
}
