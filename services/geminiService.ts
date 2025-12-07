import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, GenerationConfig, SocialPlatform, ToneStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    visualDescription: {
      type: Type.STRING,
      description: "A concise description of the decoupage item, noting colors, patterns, and base object."
    },
    craftsmanshipDetails: {
      type: Type.STRING,
      description: "Details about the technique, finish (e.g., crackle, gloss, matte), and artistic style."
    },
    posts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING },
          content: { type: Type.STRING, description: "The main body of the post, excluding hashtags." },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["platform", "content", "hashtags"]
      }
    }
  },
  required: ["visualDescription", "craftsmanshipDetails", "posts"]
};

export const generateSocialPosts = async (
  imageBase64: string,
  mimeType: string,
  config: GenerationConfig
): Promise<AnalysisResult> => {
  
  const platformsString = config.platforms.join(", ");
  const toneString = config.tone;

  const prompt = `
    You are an expert social media manager for a handmade arts and crafts business specializing in Decoupage.
    
    Analyze the attached image of a handmade decoupage creation. 
    1. First, identify the object (box, tray, furniture, bottle, etc.), the specific decoupage style (vintage, napkin technique, rice paper, mixed media), colors, and finish.
    2. Then, generate optimized social media posts for the following platforms: ${platformsString}.
    
    The tone of voice should be: ${toneString}.
    
    For each platform:
    - Adhere to platform best practices (length, structure, emoji usage).
    - For Instagram/Pinterest, focus on aesthetics and visual storytelling.
    - For Facebook, focus on community and engagement (asking questions).
    - For TikTok, write a short, catchy script or caption for a video reveal.
    - For Twitter/X, keep it punchy and concise.
    
    Include 10-15 highly relevant hashtags for discovery in the 'hashtags' array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: imageBase64
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, // Slightly creative
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};
