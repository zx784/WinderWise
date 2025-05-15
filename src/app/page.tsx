
"use client";

import { useState } from "react";
import UserPreferencesForm, { type UserPreferencesFormValues } from "@/components/wanderwise/UserPreferencesForm";
import ResultsDisplay from "@/components/wanderwise/ResultsDisplay";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { suggestCity, type SuggestCityInput, type SuggestCityOutput } from "@/ai/flows/intelligent-city-suggestion";
import { generateItinerary, type GenerateItineraryInput, type GenerateItineraryOutput } from "@/ai/flows/ai-itinerary-generation";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedCityResult, setSuggestedCityResult] = useState<SuggestCityOutput | undefined>(undefined);
  const [itineraryResult, setItineraryResult] = useState<GenerateItineraryOutput | undefined>(undefined);
  const [uploadedImageFileName, setUploadedImageFileName] = useState<string | undefined>(undefined);
  const [finalDestinationCityForDisplay, setFinalDestinationCityForDisplay] = useState<string | undefined>(undefined);

  const { toast } = useToast();

  const handleSubmit = async (values: UserPreferencesFormValues, processedTripDuration: string) => {
    setIsLoading(true);
    setError(null);
    setSuggestedCityResult(undefined);
    setItineraryResult(undefined);
    setUploadedImageFileName(values.imageFile?.[0]?.name);
    setFinalDestinationCityForDisplay(undefined);

    let finalDestinationCity = values.destinationCity;

    try {
      // Step 1: Suggest city if not provided
      if (!finalDestinationCity) {
        const suggestCityPayload: SuggestCityInput = {
          interests: values.interests,
          budget: values.budget,
          tripDuration: processedTripDuration, // Use processed duration
          travelStyle: values.travelStyle,
          customInterests: values.customInterests ? values.customInterests.split(',').map(s => s.trim()).filter(s => s) : [],
        };
        const citySuggestion = await suggestCity(suggestCityPayload);
        if (citySuggestion && citySuggestion.suggestedCity) {
          setSuggestedCityResult(citySuggestion);
          finalDestinationCity = citySuggestion.suggestedCity;
        } else {
          throw new Error("AI could not suggest a city. Please try specifying one or adjusting your preferences.");
        }
      }
      
      setFinalDestinationCityForDisplay(finalDestinationCity); // Set for display

      if (!finalDestinationCity) {
         throw new Error("Destination city is required to generate an itinerary.");
      }

      // Step 2: Generate itinerary
      const itineraryPayload: GenerateItineraryInput = {
        destinationCity: finalDestinationCity,
        interests: values.interests,
        budget: values.budget,
        tripDuration: processedTripDuration, // Use processed duration
        travelStyle: values.travelStyle,
      };
      
      const itinerary = await generateItinerary(itineraryPayload);
      setItineraryResult(itinerary);

      toast({
        title: "Travel Plan Ready!",
        description: `Your personalized plan for ${finalDestinationCity} is here.`,
        variant: "default",
      });

    } catch (e: any) {
      console.error("Error generating travel plan:", e);
      const errorMessage = e.message || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <UserPreferencesForm onSubmit={handleSubmit} isLoading={isLoading} />

      {isLoading && <LoadingSpinner text="Crafting your perfect journey..." />}

      {error && !isLoading && (
        <Alert variant="destructive" className="mt-8">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Oops! Something went wrong.</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && (suggestedCityResult || itineraryResult) && (
        <ResultsDisplay
          suggestedCity={suggestedCityResult}
          itineraryData={itineraryResult}
          uploadedImageFileName={uploadedImageFileName}
          finalDestinationCityToDisplay={finalDestinationCityForDisplay}
        />
      )}
    </div>
  );
}

