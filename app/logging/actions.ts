"use server";

import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function analyzeMeal(mealDescription: string) {
  if (!process.env.GROQ_API_KEY) {
    return {
      success: false,
      error:
        "GROQ_API_KEY is not set in .env.local or the server was not restarted.",
    };
  }

  try {
    const { object } = await generateObject({
      model: groq("openai/gpt-oss-120b"),
      system: `You are an expert nutritionist AI. ...`,
      prompt: mealDescription,
      schema: z.object({
        items: z.array(
          z.object({
            name: z.string().describe("Name of the food item"),
            quantity: z
              .number()
              .describe("Quantity or count of servings eaten"),
            unitCalories: z
              .number()
              .describe("Estimated calories for 1 unit/serving"),
            totalCalories: z
              .number()
              .describe("quantity multiplied by unitCalories"),
          }),
        ),
        totalMealCalories: z.number().describe("Sum of all totalCalories"),
      }),
    });

    return { success: true, data: object };
  } catch (error: any) {
    console.error("Detailed Groq Error:", error);
    return {
      success: false,
      error:
        error?.message || "Failed to analyze your meal. Check terminal logs.",
    };
  }
}
