"use client";

import * as React from "react";
import { useCategories } from "@/hooks/useCategories";
import { useCreateExpense } from "@/hooks/useCreateExpense";
import { Button, Input, toast } from "@/components/ui";
import { expenseFormSchema, type ExpenseFormValues } from "@/lib/validations";

interface ExpenseFormProps {
  onSuccess?: () => void;
}

/**
 * ExpenseForm — The primary interaction point for adding spend.
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

    const result = expenseFormSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach(issue => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await create(result.data);
      toast.success("Expense logged", `${result.data.description} added successfully.`);
      
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
      className="flex flex-col gap-lg"
    >
      <h3 className="text-h3 text-lg">Add Expense</h3>

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
      <div className="flex flex-col gap-2">
        <label className="text-label text-on-surface-variant opacity-70">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`
                px-3 py-1.5 rounded-full border-[1.5px] transition-all font-mono text-[12px] cursor-pointer
                ${values.category === cat 
                  ? "bg-navy border-navy text-white" 
                  : "bg-transparent border-outline-variant text-body-text hover:border-teal hover:bg-surface-container-low"}
              `}
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
        withArrow
        className="mt-sm"
      >
        Log Expense
      </Button>
    </form>
  );
}
