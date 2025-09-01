"use client";
import * as React from "react";
import { clsx } from "clsx";

export function Modal({ open, onClose, className, children }: { open: boolean; onClose: () => void; className?: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={clsx("relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-card", className)}>
        {children}
      </div>
    </div>
  );
}
