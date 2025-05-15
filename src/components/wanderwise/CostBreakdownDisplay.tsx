
"use client";

import type { GenerateItineraryOutput } from "@/ai/flows/ai-itinerary-generation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, BedDouble, Utensils, Car, Ticket, Sigma } from "lucide-react";

interface CostBreakdownDisplayProps {
  costBreakdown: GenerateItineraryOutput["costBreakdown"];
}

const costItems = [
    { key: "accommodation" as keyof GenerateItineraryOutput["costBreakdown"], label: "Accommodation", icon: BedDouble },
    { key: "food" as keyof GenerateItineraryOutput["costBreakdown"], label: "Food", icon: Utensils },
    { key: "transportation" as keyof GenerateItineraryOutput["costBreakdown"], label: "Transportation", icon: Car },
    { key: "activities" as keyof GenerateItineraryOutput["costBreakdown"], label: "Activities", icon: Ticket },
]

// Helper function to parse cost strings like "$100 - $200" or "$50"
function parseCostRange(costString: string | undefined): [number, number] {
  if (!costString || typeof costString !== 'string') return [0, 0];
  
  const cleanedString = costString.replace(/\$/g, "").trim(); // Remove all $ signs and trim
  const parts = cleanedString.split("-").map(p => parseFloat(p.trim()));

  if (parts.length === 1 && !isNaN(parts[0])) {
    return [parts[0], parts[0]];
  }
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    // Ensure the first value is the lower bound
    return [Math.min(parts[0], parts[1]), Math.max(parts[0], parts[1])];
  }
  // Return [0, 0] if parsing fails or format is unexpected
  console.warn(`Could not parse cost string: "${costString}"`);
  return [0, 0]; 
}


export default function CostBreakdownDisplay({ costBreakdown }: CostBreakdownDisplayProps) {
  if (!costBreakdown) return null;

  let totalLowerBound = 0;
  let totalUpperBound = 0;

  const individualCostsToDisplay = costItems.map(item => {
    const costValue = costBreakdown[item.key];
    if (!costValue) return null; // Skip if this cost item is not present in the data

    const [lower, upper] = parseCostRange(costValue);
    totalLowerBound += lower;
    totalUpperBound += upper;
    
    return {
      key: item.key,
      label: item.label,
      icon: item.icon,
      value: costValue, // Original string value for display
    };
  }).filter(Boolean); // Remove null entries

  const displayTotal = totalLowerBound > 0 || totalUpperBound > 0;

  return (
    <Card className="w-full shadow-lg bg-secondary/30">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
          <Coins className="h-7 w-7" /> Estimated Cost Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {individualCostsToDisplay.map(item => {
            if (!item) return null;
            return (
              <li key={item.key} className="flex justify-between items-center p-3 bg-background rounded-md shadow-sm">
                <div className="flex items-center gap-2 font-medium">
                  <item.icon className="h-5 w-5 text-accent" />
                  <span>{item.label}:</span>
                </div>
                <span className="font-semibold text-primary">{item.value}</span>
              </li>
            );
          })}
        </ul>
        {displayTotal && (
          <div className="mt-6 pt-4 border-t border-primary/20">
            <div className="flex justify-between items-center p-3 bg-background rounded-md shadow-sm">
              <div className="flex items-center gap-2 font-bold text-lg">
                <Sigma className="h-6 w-6 text-accent" />
                <span>Total Estimated Cost:</span>
              </div>
              <span className="font-bold text-lg text-primary">
                ${totalLowerBound.toLocaleString()}
                {totalLowerBound !== totalUpperBound ? ` - $${totalUpperBound.toLocaleString()}` : ''}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
