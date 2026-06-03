/**
 * Rating Component
 * Star rating display and selection
 */

import React from "react";
import { Star } from "lucide-react";
import type { RatingProps } from "../../types/ui";

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
}) => {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const isFilled = i < Math.floor(value);
        const isHalf = i === Math.floor(value) && value % 1 !== 0;

        return (
          <button
            key={i}
            onClick={() => interactive && onChange?.(i + 1)}
            disabled={!interactive}
            className={interactive ? "cursor-pointer" : "cursor-default"}
          >
            <Star
              size={20}
              className={`${sizeMap[size]} ${
                isFilled || isHalf
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-300"
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default Rating;
