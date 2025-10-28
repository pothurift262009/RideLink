import { Rating } from '../types';

/**
 * This file contains the logic for calculating a user's trust score.
 * It serves as a functional implementation of the pseudocode required
 * for the AI Trust Scoring feature.
 */

const BASE_SCORE = 3.0; // The score a new user starts with
const MAX_SCORE = 5.0;
const MIN_SCORE = 1.0;

// Keywords for simulated sentiment analysis
const POSITIVE_KEYWORDS = ['safe', 'punctual', 'clean', 'friendly', 'excellent', 'smooth', 'great', 'comfortable', 'recommend'];
const NEGATIVE_KEYWORDS = ['late', 'unsafe', 'dirty', 'rude', 'aggressive', 'unclean', 'bad', 'delay'];


/**
 * Calculates a dynamic trust score for a user based on their reviews.
 * 
 * @param reviews - An array of all ratings/reviews for a specific user.
 * @returns A new trust score between 1.0 and 5.0.
 */
export const calculateTrustScore = (reviews: Rating[]): number => {
  if (reviews.length === 0) {
    return BASE_SCORE;
  }

  // --- Step 1: Calculate the average star rating ---
  // This is the most significant factor in the score.
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  // --- Step 2: Perform simulated sentiment analysis on comments ---
  // This adds a layer of nuance to the score. Positive or negative comments
  // can adjust the score beyond just the star rating.
  let sentimentModifier = 0;
  reviews.forEach(review => {
    const comment = review.comment.toLowerCase();
    POSITIVE_KEYWORDS.forEach(keyword => {
      if (comment.includes(keyword)) {
        sentimentModifier += 0.05; // Small boost for positive language
      }
    });
    NEGATIVE_KEYWORDS.forEach(keyword => {
      if (comment.includes(keyword)) {
        sentimentModifier -= 0.1; // Larger penalty for negative language
      }
    });
  });
  
  // --- Step 3: Combine factors to calculate the new score ---
  // The logic starts with the average rating and applies the sentiment modifier.
  // A confidence factor based on the number of reviews is also applied,
  // making the score more stable as more reviews come in.
  const reviewCount = reviews.length;
  // The score moves more slowly from the average as more reviews are added.
  const confidenceFactor = 1 - (1 / (reviewCount + 1));
  
  let newScore = averageRating + (sentimentModifier * confidenceFactor);

  // --- Step 4: Clamp the score to be within the valid range [1.0, 5.0] ---
  newScore = Math.max(MIN_SCORE, Math.min(MAX_SCORE, newScore));
  
  // Return the final score, rounded to one decimal place.
  return parseFloat(newScore.toFixed(1));
};