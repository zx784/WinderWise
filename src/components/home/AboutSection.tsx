
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function AboutSection() {
  return (
    <Card className="w-full bg-white dark:bg-slate-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
          <Info className="h-7 w-7" /> About WanderWise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-foreground/80">
        <p>
          WanderWise is your intelligent travel companion, designed to craft personalized travel experiences
          effortlessly. Our mission is to take the stress out of travel planning by leveraging the power of
          AI to understand your unique preferences and generate bespoke itineraries.
        </p>
        <p>
          Whether you're seeking adventure, relaxation, cultural immersion, or a culinary journey,
          WanderWise provides data-driven suggestions, transparent cost breakdowns, and curated place
          recommendations to make your dream trip a reality.
        </p>
      </CardContent>
    </Card>
  );
}
