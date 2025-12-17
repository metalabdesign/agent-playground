"use client";

import * as React from "react";

import { cn } from "@/src/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  placeholder?: string;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, placeholder, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled={false}>
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";

