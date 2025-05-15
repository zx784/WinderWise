"use client";

import type { SuggestCityOutput } from "@/ai/flows/intelligent-city-suggestion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Lightbulb } from "lucide-react";

interface SuggestedCityCardProps {
  suggestion: SuggestCityOutput;
}

export default function SuggestedCityCard({ suggestion }: SuggestedCityCardProps) {
  if (!suggestion.suggestedCity) return null;

  return (
    <Card className="w-full bg-secondary/50 shadow-lg border-primary">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
          <Lightbulb className="h-7 w-7" />
          AI Suggested Destination
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-medium">
          <MapPin className="h-6 w-6 text-accent" />
          <span>{suggestion.suggestedCity}</span>
        </div>
        <div>
          <h4 className="font-semibold text-lg mb-1">Why this city?</h4>
          <CardDescription className="text-foreground/80">{suggestion.justification}</CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}
