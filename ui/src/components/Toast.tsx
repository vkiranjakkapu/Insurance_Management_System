import React, { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number; // Time in ms before auto-closing
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 4000,
  onClose,
}) => {
  // Auto-dismiss logic
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Dynamic Tailwind mapping based on theme type
  const themeClasses = {
    success: "bg-green-50 border-green-500",
    error: "bg-red-50 border-red-500",
    info: "bg-blue-50 border-blue-500",
  };

  return (
    <div
      className={`flex items-center justify-between min-w-[300px] max-w-[450px] p-3.5 rounded-lg border-l-4 shadow-md transition-all duration-200 animate-slide-up ${themeClasses[type]}`}
      role="alert"
    >
      {/* Toast Message */}
      <span className="text-sm font-medium text-gray-800 pr-3 leading-snug">
        {message}
      </span>

      {/* Close Action Button on Right */}
      <button
        onClick={onClose}
        className="flex items-center justify-center text-gray-400 hover:text-gray-600 font-sans text-base p-1 rounded transition-colors duration-150 focus:outline-none"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};
