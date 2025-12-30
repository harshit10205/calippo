
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeFoodImage = async (base64Image: string): Promise<NutritionData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
              },
            },
            {
              text: "Analyze this food image. Identify the primary food item and provide its estimated nutritional value per serving. Be precise with protein, fat, and carbs in grams. Provide a short, engaging fitness-focused description.",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fat: { type: Type.NUMBER },
            description: { type: Type.STRING },
            healthScore: { type: Type.NUMBER, description: "Health score from 1-100 based on nutrition" },
          },
          required: ["foodName", "calories", "protein", "carbs", "fat", "description", "healthScore"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result as NutritionData;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze image. Please try again with a clearer photo.");
  }
};
