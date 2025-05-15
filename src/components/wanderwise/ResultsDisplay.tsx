"use client";

import type { SuggestCityOutput } from "@/ai/flows/intelligent-city-suggestion";
import type { GenerateItineraryOutput } from "@/ai/flows/ai-itinerary-generation";
import SuggestedCityCard from "./SuggestedCityCard";
import ItineraryView from "./ItineraryView";
import CostBreakdownDisplay from "./CostBreakdownDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";
import PlaceCard from "./PlaceCard";

interface ResultsDisplayProps {
  suggestedCity?: SuggestCityOutput;
  itineraryData?: GenerateItineraryOutput;
  uploadedImageFileName?: string;
}

export default function ResultsDisplay({
  suggestedCity,
  itineraryData,
  uploadedImageFileName,
}: ResultsDisplayProps) {
  if (!suggestedCity && !itineraryData) {
    return null;
  }

  const allActivities = itineraryData?.itinerary.flatMap(day => day.activities) || [];
  // Create a Set of unique activity descriptions to avoid duplicates in "Key Places"
  const uniqueActivityDescriptions = new Set<string>();
  const uniqueActivities = allActivities.filter(activity => {
    if (uniqueActivityDescriptions.has(activity.description)) {
      return false;
    }
    uniqueActivityDescriptions.add(activity.description);
    return true;
  });


  return (
    <div className="space-y-8 mt-12">
      {suggestedCity && suggestedCity.suggestedCity && (
        <SuggestedCityCard suggestion={suggestedCity} />
      )}

      {uploadedImageFileName && (
         <Card className="w-full bg-secondary/30 shadow-lg">
         <CardHeader>
           <CardTitle className="text-2xl font-semibold text-primary">Uploaded Image</CardTitle>
         </CardHeader>
         <CardContent>
           <p>You uploaded: <span className="font-medium">{uploadedImageFileName}</span>.</p>
           <p className="text-sm text-muted-foreground mt-1">AI-powered place recognition and suggestions based on this image are a planned future enhancement.</p>
         </CardContent>
       </Card>
      )}

      {itineraryData && (
        <>
          <ItineraryView itineraryData={itineraryData} />
          <CostBreakdownDisplay costBreakdown={itineraryData.costBreakdown} />
          
          {uniqueActivities.length > 0 && (
            <Card className="w-full shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
                  <Map className="h-7 w-7" />
                  Key Places & Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {uniqueActivities.map((activity, index) => (
                  <PlaceCard key={`place-${index}`} activity={activity} />
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
