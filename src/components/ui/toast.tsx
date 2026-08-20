"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";
interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

const ToastContext = createContext<{
  toast: (title: string, opts?: { type?: ToastType; description?: string }) => void;
}>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const icons = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-sky-500" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (title: string, opts?: { type?: ToastType; description?: string }) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t, { id, title, type: opts?.type ?? "success", description: opts?.description }]);
      setTimeout(() => remove(id), 4200);
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:right-4 sm:left-auto">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: "spring", damping: 24, stiffness: 340 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-carbon-200 bg-white p-4 shadow-raised"
            >
              <div className="mt-0.5 shrink-0">{icons[t.type]}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-carbon-900">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs text-carbon-500">{t.description}</p>}
              </div>
              <button
                onClick={() => remove(t.id)}
                className="shrink-0 rounded-md p-1 text-carbon-400 hover:bg-carbon-100 hover:text-carbon-700"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export { cn };