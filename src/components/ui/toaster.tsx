"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, X, XCircle, Info } from "lucide-react";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-3 text-sm shadow-lg animate-in slide-in-from-bottom-2",
              {
                "bg-green-50 text-green-800 border border-green-200":
                  t.type === "success",
                "bg-red-50 text-red-800 border border-red-200":
                  t.type === "error",
                "bg-blue-50 text-blue-800 border border-blue-200":
                  t.type === "info",
              }
            )}
          >
            {t.type === "success" && <CheckCircle className="h-4 w-4" />}
            {t.type === "error" && <XCircle className="h-4 w-4" />}
            {t.type === "info" && <Info className="h-4 w-4" />}
            <span>{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="ml-2 hover:opacity-70"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function Toaster() {
  return null; // Placeholder - real toasts use ToastProvider
}
