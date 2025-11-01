import { GoogleGenAI, Type } from "@google/genai";
import { Rating, AISummary, Sentiment, AITripPlan, Ride, User, AITripSuggestion } from '../types';

const defaultSummary: AISummary = {
    summary: "This driver is new and has no reviews yet. Be the first to leave feedback!",
    sentiment: 'Neutral',
};

export const summarizeReviews = async (reviews: Rating[]): Promise<AISummary> => {
  if (reviews.length === 0) {
    return defaultSummary;
  }
  
  try {
    // Per @google/genai guidelines, initialize with process.env.API_KEY directly.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const reviewTexts = reviews.map(r => `Rating: ${r.rating}/5 - "${r.comment}"`).join('\n');
    const prompt = `
    Analyze the following user reviews for a driver on the RideLink carpooling app in India.
    Based on the reviews, provide a concise summary and a sentiment classification.

    Reviews:
    ${reviewTexts}
  `;
    
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


export const generateTripPlan = async (
  from: string,
  to: string,
  priority: string,
  allRides: Ride[],
  allUsers: User[],
): Promise<AITripPlan> => {
    // 1. Filter and summarize historical data for the specific route
    const relevantRides = allRides.filter(
        (ride) => ride.from.toLowerCase() === from.toLowerCase() && ride.to.toLowerCase() === to.toLowerCase()
    );

    if (relevantRides.length === 0) {
        return {
            bestTimeToTravel: "Data not available for this route yet.",
            estimatedCost: "No pricing data available.",
            routeInsights: "This seems to be a new route! Be one of the first to travel it.",
            driverInsights: "As this is a new route, driver data is not yet available."
        };
    }

    const prices = relevantRides.map(r => r.pricePerSeat);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const drivers = relevantRides.map(r => allUsers.find(u => u.id === r.driverId)).filter(Boolean) as User[];
    const topDriver = drivers.sort((a, b) => b.trustScore - a.trustScore)[0];
    
    const historicalDataSummary = `
      - Total rides recorded: ${relevantRides.length}
      - Average Price: ₹${avgPrice.toFixed(0)}
      - Price Range: ₹${minPrice} - ₹${maxPrice}
      - A top-rated driver on this route is ${topDriver.name} with a trust score of ${topDriver.trustScore}.
    `;
    
    try {
        // 2. Construct the prompt for Gemini
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
            You are an AI trip planner for RideLink, an Indian carpooling app.
            A user wants to travel from "${from}" to "${to}".
            The user's main priority is: "${priority}".

            Analyze the following historical ride data for this route and generate an optimal trip plan.
            
            Historical Data Summary:
            ${historicalDataSummary}

            Based on the user's priority and the data, provide a structured trip plan.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        bestTimeToTravel: {
                            type: Type.STRING,
                            description: "A concise recommendation on the best day/time to travel to meet the user's priority. E.g., 'For the lowest prices, travel on weekday mornings.'"
                        },
                        estimatedCost: {
                            type: Type.STRING,
                            description: `The average cost for this route and potential savings. E.g., 'Average price is ₹${avgPrice.toFixed(0)}. By following our suggestion, you could save up to ₹${(avgPrice - minPrice).toFixed(0)}.'`
                        },
                        routeInsights: {
                            type: Type.STRING,
                            description: "A brief summary of the route's popularity and average duration. E.g., 'This is a popular route with over 25+ rides available weekly.'"
                        },
                        driverInsights: {
                            type: Type.STRING,
                            description: `A mention of the quality of drivers. E.g., 'Highly-rated drivers like ${topDriver.name} (${topDriver.trustScore} score) are common on this route.'`
                        }
                    }
                }
            }
        });
        
        return JSON.parse(response.text);

    } catch (error) {
        console.error("Error generating trip plan from Gemini:", error);
        // Return a fallback plan on error
        return {
            bestTimeToTravel: "We couldn't generate a custom plan right now.",
            estimatedCost: `The average price is around ₹${avgPrice.toFixed(0)}.`,
            routeInsights: "This is a frequently traveled route on RideLink.",
            driverInsights: "You'll find many experienced and verified drivers."
        };
    }
};

export const suggestTripFromHistory = async (
  pastRides: Ride[]
): Promise<AITripSuggestion> => {
  if (pastRides.length === 0) {
    throw new Error("No past rides provided for suggestion.");
  }

  const historySummary = pastRides
    .map(ride => `- Travelled from ${ride.from} to ${ride.to}.`)
    .join('\n');

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      You are an AI trip planner for RideLink, an Indian carpooling app.
      A user wants a suggestion for a new trip based on their past travel history.
      Analyze the following list of their completed trips and suggest a new, interesting destination.

      User's Past Trips:
      ${historySummary}

      Based on this history, suggest a new trip. The suggestion should be for a popular nearby destination or a logical next trip.
      For example, if they often travel between major cities like Chennai and Bangalore, suggest a popular weekend getaway from one of those cities like Pondicherry or Mysore.
      Provide your response as a JSON object with 'from', 'to', and a 'reason'.
      The 'reason' should be a short, friendly explanation for why you're suggesting this trip.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            from: {
              type: Type.STRING,
              description: "The suggested departure city."
            },
            to: {
              type: Type.STRING,
              description: "The suggested destination city."
            },
            reason: {
              type: Type.STRING,
              description: "A short, friendly explanation for the suggestion. E.g., 'Since you travel to Bangalore often, how about a weekend trip to nearby Mysore?'"
            }
          },
          required: ['from', 'to', 'reason']
        }
      }
    });

    return JSON.parse(response.text);

  } catch (error) {
    console.error("Error generating trip suggestion from Gemini:", error);
    // Fallback in case of an error
    throw new Error("Could not generate a trip suggestion at this time.");
  }
};
