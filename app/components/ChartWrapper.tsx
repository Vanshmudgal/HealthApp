"use client";

import dynamic from "next/dynamic";

const WeeklyChart = dynamic(() => import("@/app/components/WeeklyChart"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] flex items-center justify-center text-[#7C9885] text-sm">
      Loading chart...
    </div>
  ),
});

export default function ChartWrapper({
  data,
  calorieGoal,
  proteinGoal,
}: {
  data: { day: string; calories: number; protein: number }[];
  calorieGoal?: number;
  proteinGoal?: number;
}) {
  return (
    <WeeklyChart
      data={data}
      calorieGoal={calorieGoal}
      proteinGoal={proteinGoal}
    />
  );
}

