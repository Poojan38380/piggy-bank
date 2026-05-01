"use client"

import { forwardRef, useId as useReactId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  /** Shows ₹ prefix — also switches to IBM Plex Mono */
  isAmount?: boolean;
  /** ID is required for label association; auto-generated if not provided */
  id?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      isAmount = false,
      id: providedId,
      className = "",
      ...props
    },
    ref
  ) => {
    // BUG-6 FIX: Use React.useId() instead of a custom module-level counter.
    // React.useId() is SSR-safe and avoids server/client hydration mismatches.
    const generatedId = useReactId();
    const id = providedId ?? generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const baseInputClass = "w-full font-sans text-[16px] font-normal text-on-surface bg-surface border-[1px] border-[rgba(50,65,88,0.20)] rounded-[10px] px-4 py-3 outline-none transition-all placeholder:text-outline placeholder:font-normal focus:border-teal focus:ring-3 focus:ring-teal/10";

    const inputClass = [
      baseInputClass,
      isAmount ? "font-mono text-[24px] font-semibold pl-[44px]" : "",
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
          {isAmount && (
            <span
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[20px] font-semibold text-navy pointer-events-none select-none opacity-50"
            >
              ₹
            </span>
          )}

          <input
            ref={ref}
            id={id}
            className={inputClass}
            aria-invalid={!!error}
            aria-describedby={
              [error ? errorId : null, helper ? helperId : null]
                .filter(Boolean)
                .join(" ") || undefined
            }
            {...props}
          />
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
            id={helperId}
            className="text-body-sm text-on-surface-variant opacity-70 mt-0.5"
          >
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// ── Textarea ──────────────────────────────────────────────

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  id?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helper, id: providedId, className = "", ...props }, ref) => {
    // BUG-6 FIX: Use React.useId() for SSR-safe ID generation
    const generatedId = useReactId();
    const id = providedId ?? generatedId;
    const errorId = `${id}-error`;

    const baseInputClass = "w-full font-sans text-[16px] font-normal text-on-surface bg-surface border-[1px] border-[rgba(50,65,88,0.20)] rounded-[10px] px-4 py-3 outline-none transition-all placeholder:text-outline placeholder:font-normal focus:border-teal focus:ring-3 focus:ring-teal/10";

    const textareaClass = [
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

        <textarea
          ref={ref}
          id={id}
          className={textareaClass}
          style={{ resize: "vertical", minHeight: 80 }}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />

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

Textarea.displayName = "Textarea";
