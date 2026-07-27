import React, { useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onSearch?: (value: string) => void;
    onClear?: () => void;
}

export const ThemedSearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    onSearch,
    onClear,
    placeholder = "Search items, users, or logs...",
    ...props
}) => {
    const [internalValue, setInternalValue] = useState("");

    // Support both controlled and uncontrolled states safely
    const isControlled = value !== undefined;
    const currentValue = isControlled ? (value as string) : internalValue;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) setInternalValue(e.target.value);
        if (onChange) onChange(e);
    };

    const handleClear = () => {
        if (!isControlled) setInternalValue("");
        if (onClear) onClear();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && onSearch) {
            onSearch(currentValue);
        }
    };

    return (
        <div className="w-full max-w-md">
            {/* Target Container for Interactive Input Group */}
            <div className="relative flex items-center rounded shadow-sm group">
                {/* Left Side Visual Anchor: Heroicon Search Icon */}
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <MagnifyingGlassIcon
                        className="w-5 h-5 text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-500"
                        aria-hidden="true"
                    />
                </div>

                {/* Form Input field handling text layout offsets */}
                <input
                    type="text"
                    value={currentValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full pl-11 pr-10 py-2.5 bg-slate-50/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                    {...props}
                />

                {/* Right Side Visual Anchor: Contextual Action Clear Button */}
                {currentValue && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-0.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150"
                            aria-label="Clear search input"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
