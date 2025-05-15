"use client";

import type { GenerateItineraryOutput } from "@/ai/flows/ai-itinerary-generation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PlaceCard from "./PlaceCard";
import { CalendarDays } from "lucide-react";

interface ItineraryViewProps {
  itineraryData: GenerateItineraryOutput;
}

export default function ItineraryView({ itineraryData }: ItineraryViewProps) {
  if (!itineraryData.itinerary || itineraryData.itinerary.length === 0) {
    return <p>No itinerary generated.</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-primary flex items-center gap-2">
        <CalendarDays className="h-8 w-8" /> Your Personalized Itinerary
      </h2>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
        {itineraryData.itinerary.map((day, index) => (
          <AccordionItem value={`item-${index}`} key={day.day} className="border-b-2 border-primary/20">
            <AccordionTrigger className="text-xl font-semibold hover:no-underline text-left py-4 px-2 bg-primary/10 hover:bg-primary/20 rounded-t-md">
              Day {day.day}
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-6 px-2 space-y-4 bg-background rounded-b-md">
              {day.activities.length > 0 ? (
                day.activities.map((activity, activityIndex) => (
                  <PlaceCard key={activityIndex} activity={activity} />
                ))
              ) : (
                <p className="text-muted-foreground">No activities planned for this day.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
