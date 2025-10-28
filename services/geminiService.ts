import { GoogleGenAI, Type } from "@google/genai";
import { Rating, AISummary, Sentiment } from '../types';

const defaultSummary: AISummary = {
    summary: "This driver is new and has no reviews yet. Be the first to leave feedback!",
    sentiment: 'Neutral',
};

export const summarizeReviews = async (reviews: Rating[]): Promise<AISummary> => {
  if (reviews.length === 0) {
    return defaultSummary;
  }
  
  // Per @google/genai guidelines, initialize with process.env.API_KEY directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const reviewTexts = reviews.map(r => `Rating: ${r.rating}/5 - "${r.comment}"`).join('\n');
  const prompt = `
    Analyze the following user reviews for a driver on the RideLink carpooling app in India.
    Based on the reviews, provide a concise summary and a sentiment classification.

    Reviews:
    ${reviewTexts}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                summary: {
                    type: Type.STRING,
                    description: "A concise, professional, and helpful summary of the reviews. Focus on safety, driving skill, punctuality, and friendliness."
                },
                sentiment: {
                    type: Type.STRING,
                    description: "The overall sentiment of the reviews. Must be one of: 'Positive', 'Negative', 'Mixed', 'Neutral'."
                }
            }
        }
      }
    });
    
    const result = JSON.parse(response.text);

    // Validate the sentiment value to match the Sentiment type
    const validSentiments: Sentiment[] = ['Positive', 'Negative', 'Mixed', 'Neutral'];
    const sentiment = validSentiments.includes(result.sentiment) ? result.sentiment : 'Neutral';

    return {
        summary: result.summary,
        sentiment: sentiment,
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes("API Key")) {
      return { 
        summary: "AI summary is currently unavailable due to a configuration issue. Please check individual reviews.",
        sentiment: 'Neutral'
      };
    }
    return {
        summary: "Could not generate an AI summary at this time. Please check the driver's individual reviews.",
        sentiment: 'Neutral'
    };
  }
};
