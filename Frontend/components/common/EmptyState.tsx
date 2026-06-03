/**
 * Empty State Component
 * Display when no data is available
 */

import React from "react";
import type { EmptyStateProps } from "../../types/ui";

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && <div className="mb-4 text-slate-300">{icon}</div>}

      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>

      {description && (
        <p className="text-slate-600 mb-6 text-center">{description}</p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
