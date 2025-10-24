import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

// Fix: Directly use process.env.API_KEY and remove the manual check,
// as per the guideline to assume the API key is pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeImageForLookalike(base64ImageData: string, language: 'en' | 'zh'): Promise<AnalysisResult> {
  
  const languageInstruction = language === 'zh'
      ? '请用中文回答所有文本内容，包括理由、角度、面相、健康和化妆建议。'
      : 'Please provide all textual responses in English, including reasons, angles, fortune, health, and makeup suggestions.';

  const celebrityInstruction = language === 'zh'
      ? '找到6位与其相貌相似的中国名人（包括中国大陆、香港或台湾）。'
      : 'Find exactly 6 Chinese celebrities (from mainland China, Hong Kong, or Taiwan) they resemble.';
  
  const prompt = `
    Analyze the person in this photo. ${languageInstruction}
    1. Identify their key facial features.
    2. ${celebrityInstruction} Each match must focus on a different, distinct facial feature or aesthetic angle (e.g., "Eye Shape", "Smile", "Jawline"). Do not use the same angle twice.
    3. For each celebrity match, provide their full name, a publicly accessible image URL of the celebrity's face, a similarity score from 0 to 100, a brief one-sentence reason for the resemblance, and the name of the angle itself.
    4. Additionally, perform a 'San Ting Wu Yan' (Three Courts and Five Eyes) facial proportion analysis. Based on this analysis, provide a short, insightful, and positive paragraph for each of the following: a 'Fortune' reading (面相运势), a 'Health' insight (健康), and a 'Makeup Suggestion' (化妆建议) to enhance their features.
    5. Return the result as a single valid JSON object that conforms to the provided schema, containing both the celebrity matches and the facial analysis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64ImageData,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            celebrityMatches: {
              type: Type.ARRAY,
              description: "An array of 6 celebrity matches.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Full name of the celebrity." },
                  imageUrl: { type: Type.STRING, description: "A publicly accessible URL for an image of the celebrity's face." },
                  similarity: { type: Type.NUMBER, description: "Similarity score from 0 to 100." },
                  reason: { type: Type.STRING, description: "Brief reason for the resemblance." },
                  angle: { type: Type.STRING, description: "The feature or perspective being compared." },
                },
                required: ["name", "imageUrl", "similarity", "reason", "angle"],
              },
            },
            facialAnalysis: {
              type: Type.OBJECT,
              description: "Analysis based on San Ting Wu Yan.",
              properties: {
                fortune: { type: Type.STRING, description: "Fortune reading based on facial features." },
                health: { type: Type.STRING, description: "Health insights based on facial features." },
                makeup: { type: Type.STRING, description: "Makeup suggestions to enhance features." },
              },
              required: ["fortune", "health", "makeup"],
            },
          },
          required: ["celebrityMatches", "facialAnalysis"],
        },
      },
    });

    const jsonText = response.text;
    const result = JSON.parse(jsonText);
    
    if (!result.celebrityMatches || !result.facialAnalysis || result.celebrityMatches.length !== 6) {
        throw new Error("API returned an unexpected data format.");
    }

    return result as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Could not get a valid response from the AI model.");
  }
}