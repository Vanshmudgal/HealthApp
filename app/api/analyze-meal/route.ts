import { streamObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { mealSchema } from "@/lib/meal-schema";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { userId: authId } = await auth();

  if (!authId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { mealDescription } = await req.json();

  if (!process.env.GROQ_API_KEY) {
    return new Response("GROQ_API_KEY is not set.", { status: 500 });
  }

  // ✅ Fetch Clerk user HERE — while the HTTP request context is still alive.
  // Calling currentUser() inside onFinish() silently returns null because
  // the request is already finished by then, breaking user creation.
  const clerkUser = await currentUser();

  const result = streamObject({
    model: groq("openai/gpt-oss-120b"),
    system: `You are an expert nutritionist AI. For each food item, estimate calories, macronutrients (protein, carbs, fat, fiber in grams), and the most relevant vitamins/minerals with amount, unit, and % daily value. Only include vitamins/minerals notably present in that food.`,
    prompt: mealDescription,
    schema: mealSchema,
    onFinish: async ({ object }) => {
      if (!object) {
        console.error("streamObject finished with no object to save.");
        return;
      }

      try {
        // Find the User row for this Clerk account, creating one if this is their first meal
        let dbUser = await prisma.user.findUnique({ where: { authId } });

        if (!dbUser) {
          const email =
            clerkUser?.emailAddresses?.[0]?.emailAddress ??
            `${authId}@placeholder.local`;

          const avatarUrl = clerkUser?.imageUrl ?? "";

          const baseName =
            clerkUser?.username ||
            [clerkUser?.firstName, clerkUser?.lastName]
              .filter(Boolean)
              .join(" ") ||
            email.split("@")[0];

          // username column is unique — check before inserting
          let username = baseName;
          const taken = await prisma.user.findUnique({ where: { username } });
          if (taken) {
            username = `${baseName}-${authId.slice(-5)}`;
          }

          dbUser = await prisma.user.create({
            data: { authId, email, username, avatarUrl },
          });
        }

        await prisma.mealLog.create({
          data: {
            userId: dbUser.id,
            rawInput: mealDescription,
            calories: Math.round(object.totalMealCalories),
            proteinG: object.totalNutrients.protein,
            carbsG: object.totalNutrients.carbs,
            fatG: object.totalNutrients.fat,
            items: object.items.map((item) => item.name),
          },
        });
      } catch (err) {
        console.error("Failed to save meal log:", err);
      }
    },
  });

  return result.toTextStreamResponse();
}
