"use client";

import * as React from "react";
import { useCategories } from "@/hooks/useCategories";
import { useCreateExpense } from "@/hooks/useCreateExpense";
import { Button, Input, Select, toast } from "@/components/ui";
import { expenseFormSchema, type ExpenseFormValues } from "@/lib/validations";

interface ExpenseFormProps {
  onSuccess?: () => void;
}

/**
 * ExpenseForm — The primary interaction point for adding spend.
 * 
 * Features:
 * - Instant Zod validation
 * - Category pill selector + "Other" fallback
 * - Large "Rupee" input with mono font
 * - Idempotent submission (resilient to double-taps/network lag)
 */
export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const { categories } = useCategories();
  const { create, isSubmitting } = useCreateExpense();

  // Form State
  const [values, setValues] = React.useState<ExpenseFormValues>({
    amount: "",
    category: "Food",
    description: "",
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof ExpenseFormValues, string>>>({});

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof ExpenseFormValues]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const setCategory = (cat: string) => {
    setValues(prev => ({ ...prev, category: cat }));
    if (errors.category) setErrors(prev => ({ ...prev, category: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate
    const result = expenseFormSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach(issue => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // 2. Submit
    try {
      await create(result.data);
      toast.success("Expense logged", `${result.data.description} added successfully.`);
      
      // 3. Reset (keep date for multi-entry convenience)
      setValues(prev => ({
        ...prev,
        amount: "",
        description: "",
      }));
      
      onSuccess?.();
    } catch (err) {
      toast.error("Failed to save", "Please check your connection and try again.");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}
    >
      <h3 className="text-h3" style={{ fontSize: "18px" }}>Add Expense</h3>

      {/* Amount Input */}
      <Input
        isAmount
        label="Amount"
        placeholder="0.00"
        name="amount"
        value={values.amount}
        onChange={handleChange}
        error={errors.amount}
        autoComplete="off"
      />

      {/* Category Pills */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label className="text-label" style={{ color: "var(--color-on-surface-variant)" }}>
          Category
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`btn-pill ${values.category === cat ? "active" : ""}`}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                padding: "6px 12px",
                borderRadius: "var(--radius-full)",
                border: "1.5px solid var(--color-outline-variant)",
                background: values.category === cat ? "var(--color-navy)" : "transparent",
                color: values.category === cat ? "white" : "var(--color-body)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <Input
        label="Description"
        placeholder="What was this for?"
        name="description"
        value={values.description}
        onChange={handleChange}
        error={errors.description}
      />

      {/* Date */}
      <Input
        label="Date"
        type="date"
        name="date"
        value={values.date}
        onChange={handleChange}
        error={errors.date}
      />

      <Button 
        type="submit" 
        isLoading={isSubmitting} 
        fullWidth
        style={{ marginTop: "var(--space-sm)" }}
      >
        Log Expense →
      </Button>

      <style>{`
        .btn-pill:hover:not(.active) {
          border-color: var(--color-teal);
          background: var(--color-surface-container-low);
        }
        .btn-pill.active {
          border-color: var(--color-navy);
        }
      `}</style>
    </form>
  );
}
