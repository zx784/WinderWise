"use client";

import type { GenerateItineraryOutput } from "@/ai/flows/ai-itinerary-generation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, BedDouble, Utensils, Car, Ticket } from "lucide-react";

interface CostBreakdownDisplayProps {
  costBreakdown: GenerateItineraryOutput["costBreakdown"];
}

const costItems = [
    { key: "accommodation" as keyof GenerateItineraryOutput["costBreakdown"], label: "Accommodation", icon: BedDouble },
    { key: "food" as keyof GenerateItineraryOutput["costBreakdown"], label: "Food", icon: Utensils },
    { key: "transportation" as keyof GenerateItineraryOutput["costBreakdown"], label: "Transportation", icon: Car },
    { key: "activities" as keyof GenerateItineraryOutput["costBreakdown"], label: "Activities", icon: Ticket },
]

export default function CostBreakdownDisplay({ costBreakdown }: CostBreakdownDisplayProps) {
  if (!costBreakdown) return null;

  return (
    <Card className="w-full shadow-lg bg-secondary/30">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
          <Coins className="h-7 w-7" /> Estimated Cost Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {costItems.map(item => {
            const costValue = costBreakdown[item.key];
            if (!costValue) return null;
            return (
              <li key={item.key} className="flex justify-between items-center p-3 bg-background rounded-md shadow-sm">
                <div className="flex items-center gap-2 font-medium">
                  <item.icon className="h-5 w-5 text-accent" />
                  <span>{item.label}:</span>
                </div>
                <span className="font-semibold text-primary">{costValue}</span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
