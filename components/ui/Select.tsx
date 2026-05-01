"use client"
import { forwardRef, useId as useReactId } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  id?: string;
  options: Array<{ value: string; label: string }>;
  /** Placeholder option shown when value is empty */
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helper,
      id: providedId,
      options,
      placeholder,
      className = "",
      ...props
    },
    ref
  ) => {
    // BUG-6 FIX: Use React.useId() instead of custom module-level counter.
    // React.useId() is SSR-safe and avoids server/client hydration mismatches.
    const generatedId = useReactId();
    const id = providedId ?? generatedId;
    const errorId = `${id}-error`;

    const baseInputClass = "w-full font-sans text-[16px] font-normal text-on-surface bg-surface border-[1px] border-[rgba(50,65,88,0.20)] rounded-[10px] px-4 py-3 outline-none transition-all cursor-pointer appearance-none pr-10 focus:border-teal focus:ring-3 focus:ring-teal/10";

    const selectClass = [
      baseInputClass,
      error ? "border-error focus:border-error focus:ring-error/10" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-label text-on-surface-variant opacity-70"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={selectClass}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown />
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-body-sm text-error mt-0.5"
          >
            {error}
          </p>
        )}

        {helper && !error && (
          <p
            className="text-body-sm text-on-surface-variant opacity-70 mt-0.5"
          >
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

function ChevronDown() {
  return (
    <svg
      aria-hidden="true"
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
