import * as React from "react";
import { clsx } from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return <input ref={ref} className={clsx("w-full h-10 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-brand", className)} {...props} />;
});
Input.displayName = "Input";
