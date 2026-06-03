/**
 * Loader Component
 * Loading spinner with different sizes
 */

import React from "react";
import type { LoaderProps } from "../../types/ui";

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  fullScreen = false,
}) => {
  const spinner = (
    <div
      className={`${sizeClasses[size]} border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center items-center">{spinner}</div>;
};

export default Loader;
