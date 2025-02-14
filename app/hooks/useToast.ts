import { useState, useCallback } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  type: ToastType;
  description: string;
  duration?: number; // Optional duration for the toast
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"; // Optional position, defaults to top-right
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = useCallback((options: ToastOptions) => {
    setToast(options);
    if (options.duration) {
      setTimeout(() => {
        setToast(null); // Hide toast after the duration
      }, options.duration);
    }
  }, []);

  const hideToast = useCallback(() => {
    setToast(null); // Hide toast
  }, []);

  // Toast methods for different types
  const toastSuccess = (message: string, duration?: number, position: "top-right" | "top-left" | "bottom-right" | "bottom-left" = "top-right") => {
    showToast({
      type: "success",
      description: message,
      duration,
      position,
    });
  };

  const toastError = (message: string, duration?: number, position: "top-right" | "top-left" | "bottom-right" | "bottom-left" = "top-right") => {
    showToast({
      type: "error",
      description: message,
      duration,
      position,
    });
  };

  const toastInfo = (message: string, duration?: number, position: "top-right" | "top-left" | "bottom-right" | "bottom-left" = "top-right") => {
    showToast({
      type: "info",
      description: message,
      duration,
      position,
    });
  };

  const toastWarning = (message: string, duration?: number, position: "top-right" | "top-left" | "bottom-right" | "bottom-left" = "top-right") => {
    showToast({
      type: "warning",
      description: message,
      duration,
      position,
    });
  };

  return {
    toast: {
      success: toastSuccess,
      error: toastError,
      info: toastInfo,
      warning: toastWarning,
    },
    hideToast,
    toastContent: toast, // The current toast message and options
  };
};