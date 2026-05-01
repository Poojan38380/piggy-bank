import * as React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  id?: string;
  options: Array<{ value: string; label: string }>;
  /** Placeholder option shown when value is empty */
  placeholder?: string;
}

let _idCounter = 0;
function useId(provided?: string): string {
  const ref = React.useRef<string | null>(null);
  if (!ref.current) {
    ref.current = provided ?? `select-${++_idCounter}`;
  }
  return ref.current;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
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
    const id = useId(providedId);
    const errorId = `${id}-error`;

    const selectClass = [
      "input",                    // reuse input base styles
      error ? "input-error" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {label && (
          <label
            htmlFor={id}
            className="text-label"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {label}
          </label>
        )}

        {/* Wrapper gives us the custom chevron */}
        <div style={{ position: "relative" }}>
          <select
            ref={ref}
            id={id}
            className={selectClass}
            style={{
              appearance: "none",
              paddingRight: 40,
              cursor: "pointer",
            }}
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

          {/* Chevron icon */}
          <ChevronDown />
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-body-sm"
            style={{ color: "var(--color-error)", marginTop: 2 }}
          >
            {error}
          </p>
        )}

        {helper && !error && (
          <p
            className="text-body-sm"
            style={{ color: "var(--color-on-surface-variant)", marginTop: 2 }}
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
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        position: "absolute",
        right: 14,
        top: "50%",
        transform: "translateY(-50%)",
        color: "var(--color-on-surface-variant)",
        pointerEvents: "none",
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
