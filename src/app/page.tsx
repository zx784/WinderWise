
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import UserPreferencesForm, { type UserPreferencesFormValues } from "@/components/wanderwise/UserPreferencesForm";
import ResultsDisplay from "@/components/wanderwise/ResultsDisplay";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Sparkles } from "lucide-react";
import { suggestCity, type SuggestCityInput, type SuggestCityOutput } from "@/ai/flows/intelligent-city-suggestion";
import { generateItinerary, type GenerateItineraryInput, type GenerateItineraryOutput } from "@/ai/flows/ai-itinerary-generation";
import { useToast } from "@/hooks/use-toast";

import OurTeamSection from "@/components/home/OurTeamSection"; // Import the new OurTeamSection
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedCityResult, setSuggestedCityResult] = useState<SuggestCityOutput | undefined>(undefined);
  const [itineraryResult, setItineraryResult] = useState<GenerateItineraryOutput | undefined>(undefined);
  const [uploadedImageFileName, setUploadedImageFileName] = useState<string | undefined>(undefined);
  const [finalDestinationCityForDisplay, setFinalDestinationCityForDisplay] = useState<string | undefined>(undefined);

  const { toast } = useToast();
  const { currentUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (values: UserPreferencesFormValues, processedTripDuration: string) => {
    setIsLoading(true);
    setError(null);
    setSuggestedCityResult(undefined);
    setItineraryResult(undefined);
    setUploadedImageFileName(values.imageFile?.[0]?.name);
    setFinalDestinationCityForDisplay(undefined);

    let finalDestinationCity = values.destinationCity;

    try {
      if (!finalDestinationCity) {
        const suggestCityPayload: SuggestCityInput = {
          interests: values.interests,
          budget: values.budget,
          tripDuration: processedTripDuration,
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
      
      setFinalDestinationCityForDisplay(finalDestinationCity); 

      if (!finalDestinationCity) {
         throw new Error("Destination city is required to generate an itinerary.");
      }

      const itineraryPayload: GenerateItineraryInput = {
        destinationCity: finalDestinationCity,
        interests: values.interests,
        budget: values.budget,
        tripDuration: processedTripDuration, 
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
    <div className="space-y-12">
      {currentUser ? (
        // Logged-in view: Generate Plan feature
        <>
          <section id="plan-trip">
            <UserPreferencesForm onSubmit={handleSubmit} isLoading={isLoading} />
          </section>

          {isLoading && <div className="flex justify-center py-8"><LoadingSpinner text="Crafting your perfect journey..." /></div>}

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
        </>
      ) : (
        // Logged-out view: Hero with cover image, "Get Started" card, and Our Team section
        <>
          <section className="relative h-[calc(100vh-150px)] min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center text-center text-white -mx-4 -mt-8 sm:-mx-6 md:-mx-8">
            {/* Full-width cover image */}
            <Image
              src="https://placehold.co/1920x1080.png"
              alt="Inspiring travel destination background"
              fill
              style={{ objectFit: "cover" }}
              className="z-0 brightness-50"
              priority
              data-ai-hint="travel landscape"
            />
            {/* Overlay content - "Get Started" Card */}
            <div className="relative z-10 p-6 md:p-8 bg-card/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-2xl max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                Discover Your Next Adventure with WanderWise
              </h1>
              <p className="text-lg md:text-xl text-foreground/90 mb-8">
                Let our AI craft personalized travel plans tailored to your interests, budget, and style.
                Spend less time planning and more time exploring!
              </p>
              <Button 
                size="lg" 
                onClick={() => router.push('/auth/login')} 
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Sparkles className="mr-2 h-5 w-5" /> Get Started
              </Button>
            </div>
          </section>

          {/* Our Team Section - visible when logged out on homepage */}
          <section className="mt-12">
            <OurTeamSection />
          </section>
        </>
      )}
    </div>
  );
}
