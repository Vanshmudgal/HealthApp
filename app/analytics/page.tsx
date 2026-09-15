import { auth } from "@clerk/nextjs/server";
import Navbar from "@/app/components/Navbar";
import { prisma } from "@/lib/prisma";
import WeeklyChart from "@/app/components/WeeklyChart";

export default async function AnalyticsPage() {
  const { userId: authId } = await auth();

  if (!authId) {
    return (
      <div className="min-h-screen bg-[#16211B] text-[#EFE9DC]">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 py-12 md:px-10">
          <p className="text-[#B9C2B7]">
            Please sign in to view your analytics.
          </p>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { authId },
    include: { goal: true },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-[#16211B] text-[#EFE9DC]">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 py-12 md:px-10">
          <p className="text-[#B9C2B7]">
            No account data found yet. Log a meal first.
          </p>
        </div>
      </div>
    );
  }

  // Build the last 7 days (oldest -> newest), each starting at midnight local time
  const days: {
    date: Date;
    label: string;
    calories: number;
    protein: number;
  }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push({
      date: d,
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      calories: 0,
      protein: 0,
    });
  }

  const sevenDaysAgo = days[0].date;

  const logs = await prisma.mealLog.findMany({
    where: {
      userId: user.id,
      loggedAt: { gte: sevenDaysAgo },
    },
    orderBy: { loggedAt: "asc" },
  });

  for (const log of logs) {
    const logDate = new Date(log.loggedAt);
    logDate.setHours(0, 0, 0, 0);
    const bucket = days.find((d) => d.date.getTime() === logDate.getTime());
    if (bucket) {
      bucket.calories += log.calories;
      bucket.protein += log.proteinG;
    }
  }

  const totalCalories = days.reduce((sum, d) => sum + d.calories, 0);
  const totalProtein = days.reduce((sum, d) => sum + d.protein, 0);
  const daysWithLogs = days.filter((d) => d.calories > 0).length || 1;
  const avgCalories = Math.round(totalCalories / daysWithLogs);
  const avgProtein = Math.round(totalProtein / daysWithLogs);

  const chartData = days.map((d) => ({
    day: d.label,
    calories: Math.round(d.calories),
    protein: Math.round(d.protein),
  }));

  return (
    <div className="min-h-screen bg-[#16211B] text-[#EFE9DC]">
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 py-12 md:px-10">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold mb-2">Your week</h1>
          <p className="text-[#B9C2B7]">
            Calories and protein over the last 7 days
          </p>
        </header>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 mb-10 md:grid-cols-4">
          <StatCard
            label="Total calories"
            value={totalCalories.toLocaleString()}
          />
          <StatCard
            label="Avg cal / day"
            value={avgCalories.toLocaleString()}
          />
          <StatCard
            label="Total protein"
            value={`${Math.round(totalProtein)}g`}
          />
          <StatCard label="Avg protein / day" value={`${avgProtein}g`} />
        </div>

        {/* Chart */}
        <div className="rounded-md border border-[#2B3A31] bg-[#1B2820] p-6 mb-10">
          <h2 className="text-lg font-medium mb-6 text-[#EFE9DC]">
            Daily breakdown
          </h2>
          <WeeklyChart
            data={chartData}
            calorieGoal={user.goal?.dailyCalories}
            proteinGoal={user.goal?.proteinG}
          />
        </div>

        {logs.length === 0 && (
          <div className="rounded-md border border-[#2B3A31] bg-[#1B2820] p-6 text-center text-[#B9C2B7]">
            No meals logged in the last 7 days yet.
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#2B3A31] bg-[#1B2820] px-4 py-4 text-center">
      <div
        className="text-2xl text-[#DDA53B]"
        style={{ fontFamily: "var(--font-display, inherit)" }}
      >
        {value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wide text-[#7C9885]">
        {label}
      </div>
    </div>
  );
}
