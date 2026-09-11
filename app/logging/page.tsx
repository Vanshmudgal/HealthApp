"use client";

import { useState } from "react";
import { analyzeMeal } from "./actions";

// Types matching our Zod schema
type MealData = {
  items: {
    name: string;
    quantity: number;
    unitCalories: number;
    totalCalories: number;
  }[];
  totalMealCalories: number;
};

export default function LoggingPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MealData | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    const res = await analyzeMeal(input);

    if (res.success && res.data) {
      setResult(res.data);
    } else {
      setError(res.error || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#16211B] text-[#EFE9DC] px-6 py-12 md:px-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-12">
          <h1 className="text-3xl font-semibold text-[#EFE9DC] mb-2">
            Log your meal
          </h1>
          <p className="text-[#B9C2B7]">
            Type what you ate naturally, like &quot;2 slices of pizza and a
            coke&quot;
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mb-10">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 3 scrambled eggs, 2 slices of toast with butter..."
            className="w-full rounded-md border border-[#2B3A31] bg-[#1B2820] p-4 text-[1.05rem] text-[#EFE9DC] placeholder-[#7C9885] shadow-inner focus:border-[#DDA53B] focus:outline-none focus:ring-1 focus:ring-[#DDA53B] min-h-[120px] resize-y"
          />
          <button
            type="submit"
            className="mt-4 rounded-sm bg-[#DDA53B] px-6 py-3 text-sm font-medium text-[#16211B] transition-colors hover:bg-[#e8b657]"
          >
            {loading ? "Analyzing meal..." : "Calculate Calories"}
          </button>
        </form>

        {error && (
          <div className="rounded-md bg-red-900/20 border border-red-900 p-4 text-red-400 text-sm mb-8">
            {error}
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="rounded-md border border-[#2B3A31] bg-[#1B2820] p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-medium text-[#DDA53B] mb-6">
              Total: {result.totalMealCalories} kcal
            </h2>

            <div className="space-y-4">
              {result.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-[#2B3A31] pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <div className="font-medium text-[#EFE9DC] capitalize">
                      {item.name}
                    </div>
                    <div className="text-sm text-[#7C9885] mt-1">
                      {item.quantity} x {item.unitCalories} kcal
                    </div>
                  </div>
                  <div className="text-lg font-medium text-[#EFE9DC]">
                    {item.totalCalories}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
