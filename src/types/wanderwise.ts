
import type { SuggestCityOutput } from "@/ai/flows/intelligent-city-suggestion";
import type { GenerateItineraryOutput } from "@/ai/flows/ai-itinerary-generation";

export interface SavedPlan {
  id: string; // Firestore document ID
  userId: string; // UID of the user who saved the plan
  timestamp: number; // Timestamp of when the plan was saved
  suggestedCity?: SuggestCityOutput;
  itineraryData?: GenerateItineraryOutput;
  finalDestinationCityToDisplay?: string;
  uploadedImageFileName?: string;
}

