"use client";

import { useEffect, useState } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

let toastListeners: ((toast: Toast) => void)[] = [];
let toastId = 0;

export function showToast(message: string, type: "success" | "error" = "success") {
  const toast = { id: ++toastId, message, type };
  toastListeners.forEach((listener) => listener(toast));
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3500);
    };
    toastListeners.push(handler);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== handler);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-xl text-sm font-medium shadow-2xl border backdrop-blur-md
            ${toast.type === "success"
              ? "bg-black/90 text-white border-zinc-700"
              : "bg-red-900/90 text-red-100 border-red-700"
            }
          `}
          style={{ animation: "slideInRight 0.3s ease-out" }}
        >
          <div className="flex items-center gap-2">
            <span>{toast.type === "success" ? "✓" : "✕"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
