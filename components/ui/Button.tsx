import * as React from "react";

type ButtonVariant = "primary" | "ghost" | "teal" | "teal-soft";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  /** Appends a → arrow after children (Fenmo signature for primary CTAs) */
  withArrow?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:   "bg-charcoal text-white hover:bg-[#3a3737] active:bg-[#1a1818]",
  ghost:     "bg-transparent border-[1.5px] border-navy text-navy hover:bg-navy/5",
  teal:      "bg-teal text-white hover:bg-[#155f56]",
  "teal-soft": "bg-teal-soft text-navy hover:bg-[#aecfc8]",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "text-[12px] px-4 py-2",
  md: "text-[14px] px-6 py-3",
  lg: "text-[16px] px-8 py-4",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      withArrow = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses = "inline-flex items-center justify-center gap-1.5 font-mono font-semibold rounded-[10px] cursor-pointer transition-all no-underline whitespace-nowrap select-none disabled:opacity-55 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2";
    
    const classes = [
      baseClasses,
      variantClass[variant],
      sizeClass[size],
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>Saving…</span>
          </>
        ) : (
          <>
            {children}
            {withArrow && (
              <span aria-hidden="true" className="ml-1">
                →
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// ── Inline spinner ────────────────────────────────────────

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      className="animate-spin flex-shrink-0"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
