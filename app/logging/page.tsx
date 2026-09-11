"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { mealSchema } from "../api/analyze-meal/route";

export default function LoggingPage() {
  const { object, submit, isLoading, error } = useObject({
    api: "/api/analyze-meal",
    schema: mealSchema,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = new FormData(e.currentTarget).get("meal") as string;
    if (!input.trim()) return;
    submit({ mealDescription: input });
  };

  return (
    <div className="min-h-screen bg-[#16211B] text-[#EFE9DC] px-6 py-12 md:px-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-12">
          <h1 className="text-3xl font-semibold mb-2">Log your meal</h1>
          <p className="text-[#B9C2B7]">
            Type what you ate naturally, like &quot;2 slices of pizza and a
            coke&quot;
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mb-10">
          <textarea
            name="meal"
            placeholder="e.g., 3 scrambled eggs, 2 slices of toast with butter..."
            className="w-full rounded-md border border-[#2B3A31] bg-[#1B2820] p-4 text-[1.05rem] placeholder-[#7C9885] min-h-[120px] resize-y focus:border-[#DDA53B] focus:outline-none focus:ring-1 focus:ring-[#DDA53B]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 rounded-sm bg-[#DDA53B] px-6 py-3 text-sm font-medium text-[#16211B] hover:bg-[#e8b657] disabled:opacity-60"
          >
            {isLoading ? "Analyzing meal..." : "Calculate Calories"}
          </button>
        </form>

        {error && (
          <div className="rounded-md bg-red-900/20 border border-red-900 p-4 text-red-400 text-sm mb-8">
            Something went wrong. Please try again.
          </div>
        )}

        {object && (
          <div className="rounded-md border border-[#2B3A31] bg-[#1B2820] p-6 shadow-xl">
            <h2 className="text-xl font-medium text-[#DDA53B] mb-2">
              Total: {object.totalMealCalories ?? "…"} kcal
            </h2>

            {object.totalNutrients && (
              <div className="grid grid-cols-4 gap-2 mb-6 mt-4">
                <MacroPill
                  label="Protein"
                  value={object.totalNutrients.protein}
                />
                <MacroPill label="Carbs" value={object.totalNutrients.carbs} />
                <MacroPill label="Fat" value={object.totalNutrients.fat} />
                <MacroPill label="Fiber" value={object.totalNutrients.fiber} />
              </div>
            )}

            <div className="space-y-5">
              {object.items?.map((item, i) => (
                <div
                  key={i}
                  className="border-b border-[#2B3A31] pb-5 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium capitalize">{item?.name}</div>
                      <div className="text-sm text-[#7C9885] mt-1">
                        {item?.quantity} x {item?.unitCalories} kcal
                      </div>
                    </div>
                    <div className="text-lg font-medium">
                      {item?.totalCalories}
                    </div>
                  </div>

                  {item?.nutrients && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-[#B9C2B7]">
                      <span>P: {item.nutrients.protein}g</span>
                      <span>C: {item.nutrients.carbs}g</span>
                      <span>F: {item.nutrients.fat}g</span>
                      <span>Fiber: {item.nutrients.fiber}g</span>
                    </div>
                  )}

                  {item?.vitamins && item.vitamins.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.vitamins.map((v, vi) => (
                        <span
                          key={vi}
                          className="rounded-full border border-[#2B3A31] bg-[#16211B] px-2.5 py-1 text-[11px] text-[#7C9885]"
                        >
                          {v?.name}: {v?.amount}
                          {v?.unit}
                          <span className="text-[#DDA53B] ml-1">
                            {v?.percentDailyValue}% DV
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MacroPill({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-md bg-[#16211B] border border-[#2B3A31] px-3 py-2 text-center">
      <div className="text-sm font-medium">{value ?? "…"}g</div>
      <div className="text-[10px] uppercase tracking-wide text-[#7C9885]">
        {label}
      </div>
    </div>
  );
}
