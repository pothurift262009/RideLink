import { GoogleGenAI } from "@google/genai";
import { Rating } from '../types';

export const summarizeReviews = async (reviews: Rating[]): Promise<string> => {
  if (reviews.length === 0) {
    return "This driver is new and has no reviews yet. Be the first to leave feedback!";
  }
  
  // Per @google/genai guidelines, initialize with process.env.API_KEY directly.
  // Initialization is moved here to prevent app crash on load if API_KEY is not yet available.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const reviewTexts = reviews.map(r => `Rating: ${r.rating}/5 - "${r.comment}"`).join('\n');
  const prompt = `
    You are a trust and safety analyst for a carpooling app in India called RideLink.
    Your task is to summarize the following user reviews for a driver into a concise, professional, and helpful paragraph.
    Focus on key insights related to safety, driving skill, punctuality, and friendliness.
    Do not invent information. Base your summary solely on the provided reviews.
    If reviews are mixed, reflect that in the summary.
    
    Here are the reviews:
    ${reviewTexts}

    Please provide the summary.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes("API Key")) {
      return "AI summary is currently unavailable due to a configuration issue. Please check individual reviews.";
    }
    return "Could not generate an AI summary at this time. Please check the driver's individual reviews.";
  }
};

export const getSupportResponse = async (userPrompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are a friendly and knowledgeable support agent for RideLink, an intercity carpooling platform in India. Your goal is to provide helpful, concise, and polite assistance to users. Answer questions about booking rides, offering rides, payments, safety features, and user verification. If you don't know an answer, politely say you need to check with the support team. Keep your answers brief and easy to understand.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for support:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
};