import * as React from "react";

// ── Input ─────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  /** Shows ₹ prefix — also switches to IBM Plex Mono */
  isAmount?: boolean;
  /** ID is required for label association; auto-generated if not provided */
  id?: string;
}

let _idCounter = 0;
function useId(provided?: string): string {
  const ref = React.useRef<string | null>(null);
  if (!ref.current) {
    ref.current = provided ?? `input-${++_idCounter}`;
  }
  return ref.current;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
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
    const id = useId(providedId);
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const inputClass = [
      "input",
      isAmount ? "input-amount" : "",
      error ? "input-error" : "",
      isAmount ? "pl-10" : "",           // space for ₹ prefix
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

        <div style={{ position: "relative" }}>
          {isAmount && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                fontFamily: "var(--font-mono)",
                fontSize: isAmount ? "1.25rem" : "1rem",
                fontWeight: 600,
                color: "var(--color-on-surface-variant)",
                pointerEvents: "none",
                userSelect: "none",
              }}
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
            className="text-body-sm"
            style={{ color: "var(--color-error)", marginTop: 2 }}
          >
            {error}
          </p>
        )}

        {helper && !error && (
          <p
            id={helperId}
            className="text-body-sm"
            style={{
              color: "var(--color-on-surface-variant)",
              marginTop: 2,
            }}
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

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helper, id: providedId, className = "", ...props }, ref) => {
    const id = useId(providedId);
    const errorId = `${id}-error`;

    const textareaClass = [
      "input",
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

Textarea.displayName = "Textarea";
