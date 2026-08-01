import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { ActionButtonProps } from "../../components/ActionButton";
import ActionButton from "../../components/ActionButton";
import { type UsePaginationReturn } from "../../components/common/usePagination";
import SearchInputComponent from "../../components/SearchInputComponent";

type DashboardLayoutProps<T> = {
    children: ReactNode;
    dataFetchProgress?: boolean;
    title: string;
    breadCrumbs?: { anchors: { text: string; uri: string }[] };
    description: string;
    actionButtons?: ActionButtonProps[];
    pagination?: UsePaginationReturn<T>;
    searchField?: {
        placeHolder?: string;
        matchInfo?: string;
        handleSearch: (input: string) => void;
    };
    body?: T;
};

export default function DashboardLayout<T>({
    children,
    dataFetchProgress,
    title,
    breadCrumbs,
    description,
    actionButtons,
    pagination,
    searchField: handleSearch,
}: DashboardLayoutProps<T>) {
    const navigate = useNavigate();
    return (
        <>
            <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
                {/* Header Bar */}
                <div className="flex flex-col items-start gap-3 justify-start border-b border-slate-200 px-6 py-4 dark:border-slate-800 md:flex-row md:justify-between md:items-center">
                    <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            {breadCrumbs
                                ? breadCrumbs.anchors.map((path, idx) => {
                                      const isLast =
                                          idx ===
                                          breadCrumbs.anchors.length - 1;
                                      return (
                                          <a
                                              key={idx}
                                              onClick={() => {
                                                  navigate(path.uri);
                                              }}
                                              className={`text-indigo-600 cursor-pointer dark:text-slate-100 transition-colors duration-75 capitalize ${
                                                  isLast
                                                      ? "font-semibold text-slate-800 dark:text-slate-100 pointer-events-none"
                                                      : "hover:text-indigo-500 dark:hover:text-indigo-400"
                                              }`}
                                              aria-current={
                                                  isLast ? "page" : undefined
                                              }
                                          >
                                              {path.text}
                                              {/* Render the structural separator ONLY if it is not the last item */}
                                              {!isLast && (
                                                  <span className="text-slate-400 dark:text-white mx-1 select-none">
                                                      /
                                                  </span>
                                              )}
                                          </a>
                                      );
                                  })
                                : title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {description}
                        </p>
                    </div>

                    {actionButtons && actionButtons?.length != 0 && (
                        <div
                            className="inline-flex flex-col rounded-lg shadow-sm outline-1 outline-offset-2 outline-indigo-500 md:flex-row"
                            role="group"
                        >
                            {actionButtons?.map((btn, idx) => {
                                const isFirst = idx === 0;
                                const isLast =
                                    idx === actionButtons!.length - 1;
                                const roundedClass =
                                    isFirst && isLast
                                        ? "rounded-lg"
                                        : isFirst
                                          ? actionButtons.length == 2
                                              ? "border-e border-indigo-900 rounded-t-lg md:rounded-s-lg md:rounded-tr-none"
                                              : "rounded-t-lg md:rounded-s-lg md:rounded-tr-none"
                                          : isLast
                                            ? "rounded-b-lg md:rounded-e-lg md:rounded-bl-none"
                                            : "border-s border-e border-indigo-900";
                                return (
                                    <ActionButton
                                        text={btn.text}
                                        icon={btn.icon}
                                        onClick={btn.onClick}
                                        key={idx}
                                        className={`${roundedClass} px-3.5 py-2`}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
                {/* Search and Pagination section */}
                {(pagination || handleSearch) && (
                    <div className="px-6 py-4 flex gap-2 flex-col items-start justify-between border-b border-slate-200 dark:border-slate-800 md:flex-row md:items-center">
                        {handleSearch && (
                            <SearchInputComponent
                                matchInfo={handleSearch.matchInfo}
                                placeholder={handleSearch.placeHolder}
                                onChange={(e) =>
                                    handleSearch.handleSearch(e.target.value)
                                }
                                onClear={() => handleSearch.handleSearch("")}
                            />
                        )}
                        {pagination && (
                            <div className={`w-full md:w-auto`}>
                                <div className="flex flex-col justify-end items-center gap-3 md:flex-row">
                                    <div
                                        className="inline-flex rounded-lg shadow-sm outline-1 outline-offset-2 outline-indigo-500 md:order-last"
                                        role="group"
                                    >
                                        <ActionButton
                                            icon={ChevronLeftIcon}
                                            onClick={pagination.goToPrevPage}
                                            disabled={
                                                pagination.currentPage == 1
                                            }
                                            className="rounded-s-lg"
                                        />
                                        <ActionButton
                                            icon={ChevronRightIcon}
                                            onClick={pagination.goToNextPage}
                                            disabled={
                                                pagination.currentPage ==
                                                pagination.totalPages
                                            }
                                            className="rounded-e-lg"
                                        />
                                    </div>
                                    <span className="text-xs text-gray-800 dark:text-white">
                                        It's Page {pagination.currentPage} of{" "}
                                        {pagination.totalPages} pages
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div className="px-6 py-4">
                    {dataFetchProgress ? (
                        <div className="inline-flex items-center gap-2 justify-center w-full">
                            <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600"></div> Fetching Data..
                        </div>
                    ) : (
                        children
                    )}
                </div>
            </div>
        </>
    );
}
