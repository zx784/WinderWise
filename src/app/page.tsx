
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation'; // Added for redirection
import { useAuth } from "@/context/AuthContext"; // Added to check auth state
import UserPreferencesForm, { type UserPreferencesFormValues } from "@/components/wanderwise/UserPreferencesForm";
import ResultsDisplay from "@/components/wanderwise/ResultsDisplay";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Sparkles } from "lucide-react";
import { suggestCity, type SuggestCityInput, type SuggestCityOutput } from "@/ai/flows/intelligent-city-suggestion";
import { generateItinerary, type GenerateItineraryInput, type GenerateItineraryOutput } from "@/ai/flows/ai-itinerary-generation";
import { useToast } from "@/hooks/use-toast";

// New Home Page Sections
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import ContactSection from "@/components/home/ContactSection";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedCityResult, setSuggestedCityResult] = useState<SuggestCityOutput | undefined>(undefined);
  const [itineraryResult, setItineraryResult] = useState<GenerateItineraryOutput | undefined>(undefined);
  const [uploadedImageFileName, setUploadedImageFileName] = useState<string | undefined>(undefined);
  const [finalDestinationCityForDisplay, setFinalDestinationCityForDisplay] = useState<string | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);

  const { toast } = useToast();
  const { currentUser } = useAuth(); // Get current user from AuthContext
  const router = useRouter(); // Initialize router

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

      // Step 2: Generate itinerary
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

  const handleGetStartedClick = () => {
    if (currentUser) { // If user is logged in
      setShowForm(true); // Show the planning form
    } else { // If user is not logged in
      router.push('/auth/login'); // Redirect to login page
    }
  };

  return (
    <div className="space-y-12"> {/* Added more spacing */}
      {/* Hero Section - Integrated existing form toggle here */}
      <section className="text-center py-12 md:py-20 bg-card dark:bg-slate-800/50 rounded-xl shadow-xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Discover Your Next Adventure with WanderWise
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
          Let our AI craft personalized travel plans tailored to your interests, budget, and style.
          Spend less time planning and more time exploring!
        </p>
        {!showForm && (
          <Button size="lg" onClick={handleGetStartedClick} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Sparkles className="mr-2 h-5 w-5" /> Get Started
          </Button>
        )}
      </section>

      {showForm && (
        <section id="plan-trip">
          <UserPreferencesForm onSubmit={handleSubmit} isLoading={isLoading} />
        </section>
      )}

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

      {/* New Informational Sections */}
      <section id="about-us">
        <AboutSection />
      </section>
      <section id="our-services">
        <ServicesSection />
      </section>
      <section id="contact-us">
        <ContactSection />
      </section>
    </div>
  );
}
