// src/components/ui/rating.tsx
import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  onValueChange?: (value: number) => void;
  icon?: React.ReactNode;
  emptyIcon?: React.ReactNode;
  max?: number;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value = 0,
      onValueChange,
      max = 5,
      readOnly = false,
      icon,
      emptyIcon,
      size = "md",
      className,
    },
    ref
  ) => {
    const [hoveredValue, setHoveredValue] = React.useState<number | null>(null);

    const handleMouseLeave = () => {
      if (!readOnly) {
        setHoveredValue(null);
      }
    };

    const handleMouseEnter = (newValue: number) => {
      if (!readOnly) {
        setHoveredValue(newValue);
      }
    };

    const handleClick = (newValue: number) => {
      if (!readOnly && onValueChange) {
        onValueChange(newValue);
      }
    };

    const displayValue = hoveredValue !== null ? hoveredValue : value;

    const sizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    return (
      <div
        ref={ref}
        className={cn("flex", sizeClasses[size], className)}
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: max }).map((_, index) => {
          const starValue = index + 1;
          const filled = starValue <= displayValue;

          return (
            <div
              key={index}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onClick={() => handleClick(starValue)}
              className={cn("cursor-pointer", readOnly && "cursor-default")}
            >
              {filled
                ? icon || <Star className="fill-[#f5b400] stroke-[#f5b400]" />
                : emptyIcon || (
                    <Star className="fill-gray-200 stroke-gray-200" />
                  )}
            </div>
          );
        })}
      </div>
    );
  }
);

Rating.displayName = "Rating";
