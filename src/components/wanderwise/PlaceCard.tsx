"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Layers } from "lucide-react";
import type { GenerateItineraryOutput } from "@/ai/flows/ai-itinerary-generation";

type Activity = GenerateItineraryOutput["itinerary"][0]["activities"][0];

interface PlaceCardProps {
  activity: Activity;
}

export default function PlaceCard({ activity }: PlaceCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-card">
      <CardHeader>
        <CardTitle className="text-xl text-primary">{activity.description}</CardTitle>
        {activity.time && (
          <div className="flex items-center text-sm text-muted-foreground pt-1">
            <Clock className="h-4 w-4 mr-1.5" />
            <span>{activity.time}</span>
          </div>
        )}
      </CardHeader>
      {activity.alternatives && activity.alternatives.length > 0 && (
        <CardContent>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5 text-muted-foreground">
                <Layers className="h-4 w-4" />
                Alternatives:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80">
            {activity.alternatives.map((alt, index) => (
              <li key={index}>{alt}</li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}
