import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const explainPiIrrationality = async (): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Please configure your API Key to fetch the explanation.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Explain briefly (max 3 sentences) why walking 1 radian steps around a circle creates a non-repeating pattern that demonstrates Pi's irrationality. Keep it simple and philosophical.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, 
        temperature: 0.7,
      }
    });
    return response.text || "No explanation available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to contact the cosmic AI at this moment.";
  }
};
