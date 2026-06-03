"use client";
import React from "react";
import { useToastStore } from "@/lib/store/toast";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 md:px-0">
      {toasts.map((t) => {
        let Icon = CheckCircle;
        let bgClass = "bg-white border-green-100 text-slate-800 shadow-[0_4px_20px_-2px_rgba(34,197,94,0.15)]";
        let iconColor = "text-green-500";

        if (t.type === "error") {
          Icon = AlertCircle;
          bgClass = "bg-white border-red-100 text-slate-800 shadow-[0_4px_20px_-2px_rgba(239,68,68,0.15)]";
          iconColor = "text-red-500";
        } else if (t.type === "warning") {
          Icon = AlertTriangle;
          bgClass = "bg-white border-amber-100 text-slate-800 shadow-[0_4px_20px_-2px_rgba(245,158,11,0.15)]";
          iconColor = "text-amber-500";
        } else if (t.type === "info") {
          Icon = Info;
          bgClass = "bg-white border-blue-100 text-slate-800 shadow-[0_4px_20px_-2px_rgba(59,130,246,0.15)]";
          iconColor = "text-blue-500";
        }

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border ${bgClass} transition-all duration-300 transform translate-y-0 scale-100 opacity-100 animate-in slide-in-from-bottom-5 fade-in duration-300`}
          >
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-lg bg-slate-50">
                <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
              </div>
              <p className="text-sm font-semibold">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
