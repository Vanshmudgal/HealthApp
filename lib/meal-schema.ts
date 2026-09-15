import { z } from "zod";

const nutrientSchema = z.object({
  protein: z.number().describe("Protein in grams"),
  carbs: z.number().describe("Carbohydrates in grams"),
  fat: z.number().describe("Fat in grams"),
  fiber: z.number().describe("Fiber in grams"),
});

const vitaminSchema = z.object({
  name: z
    .string()
    .describe("Vitamin or mineral name, e.g. 'Vitamin C', 'Iron'"),
  amount: z.number().describe("Amount present"),
  unit: z.string().describe("Unit of measurement, e.g. 'mg', 'mcg', 'IU'"),
  percentDailyValue: z
    .number()
    .describe("Approximate % of daily recommended value"),
});

export const mealSchema = z.object({
  items: z.array(
    z.object({
      name: z.string().describe("Name of the food item"),
      quantity: z.number().describe("Quantity or count of servings eaten"),
      unitCalories: z
        .number()
        .describe("Estimated calories for 1 unit/serving"),
      totalCalories: z.number().describe("quantity multiplied by unitCalories"),
      nutrients: nutrientSchema.describe("Total macronutrients for this item"),
      vitamins: z
        .array(vitaminSchema)
        .describe("Notable vitamins/minerals for this item"),
    }),
  ),
  totalMealCalories: z.number().describe("Sum of all totalCalories"),
  totalNutrients: nutrientSchema.describe(
    "Sum of macronutrients across all items",
  ),
});
