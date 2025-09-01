import * as React from "react";
import { clsx } from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-xl font-medium transition-shadow hover:shadow disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
      default: "bg-brand text-white hover:bg-brand-dark",
      outline: "border border-gray-300 hover:bg-gray-50",
      ghost: "hover:bg-gray-100",
      destructive: "bg-red-600 text-white hover:bg-red-700"
    } as const;
    const sizes = { sm: "h-9 px-3 text-sm", md: "h-10 px-4", lg: "h-11 px-6 text-lg" } as const;
    return <button ref={ref} className={clsx(base, variants[variant], sizes[size], className)} {...props} />;
  }
);
Button.displayName = "Button";
