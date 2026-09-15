"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type DayData = {
  day: string;
  calories: number;
  protein: number;
};

export default function WeeklyChart({
  data,
  calorieGoal,
  proteinGoal,
}: {
  data: DayData[];
  calorieGoal?: number;
  proteinGoal?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#2B3A31" />
        <XAxis
          dataKey="day"
          stroke="#7C9885"
          tick={{ fill: "#B9C2B7", fontSize: 12 }}
        />
        <YAxis
          yAxisId="calories"
          orientation="left"
          stroke="#7C9885"
          tick={{ fill: "#B9C2B7", fontSize: 12 }}
        />
        <YAxis
          yAxisId="protein"
          orientation="right"
          stroke="#7C9885"
          tick={{ fill: "#B9C2B7", fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1B2820",
            border: "1px solid #2B3A31",
            borderRadius: "6px",
            color: "#EFE9DC",
          }}
          labelStyle={{ color: "#EFE9DC" }}
        />
        <Legend wrapperStyle={{ color: "#B9C2B7", fontSize: 12 }} />

        {calorieGoal && (
          <ReferenceLine
            yAxisId="calories"
            y={calorieGoal}
            stroke="#DDA53B"
            strokeDasharray="4 4"
            label={{
              value: "Cal goal",
              fill: "#DDA53B",
              fontSize: 10,
              position: "right",
            }}
          />
        )}

        <Bar
          yAxisId="calories"
          dataKey="calories"
          fill="#DDA53B"
          radius={[3, 3, 0, 0]}
          name="Calories"
        />
        <Line
          yAxisId="protein"
          type="monotone"
          dataKey="protein"
          stroke="#7FB3D5"
          strokeWidth={2}
          dot={{ r: 4, fill: "#7FB3D5" }}
          name="Protein (g)"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
