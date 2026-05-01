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
  primary:   "btn btn-primary",
  ghost:     "btn btn-ghost",
  teal:      "btn btn-teal",
  "teal-soft": "btn btn-teal-soft",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
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
    const classes = [
      variantClass[variant],
      sizeClass[size],
      fullWidth ? "btn-full" : "",
      "focus-ring",
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
              <span aria-hidden="true" style={{ marginLeft: 4 }}>
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
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{
        animation: "spin 0.75s linear infinite",
        flexShrink: 0,
      }}
    >
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
