
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, Bot, Wallet, MapPinned, Camera } from "lucide-react";

const services = [
  {
    icon: Bot,
    title: "Intelligent City Suggestion",
    description: "Don't know where to go? Our AI suggests cities based on your interests, budget, and travel style.",
  },
  {
    icon: ListChecks,
    title: "AI Itinerary Generation",
    description: "Get personalized, day-by-day itineraries with activity descriptions and alternatives.",
  },
  {
    icon: Wallet,
    title: "Transparent Cost Breakdown",
    description: "Understand your trip expenses with detailed breakdowns for accommodation, food, and more.",
  },
  {
    icon: MapPinned,
    title: "Curated Place Recommendations",
    description: "Discover key places to visit, categorized by your interests, with engaging descriptions.",
  },
  {
    icon: Camera,
    title: "Image-Driven Recommendations",
    description: "Upload images of places, and our AI will identify landmarks and suggest nearby attractions (future feature).",
  },
];

export default function ServicesSection() {
  return (
    <Card className="w-full bg-white dark:bg-slate-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
          <ListChecks className="h-7 w-7" /> Our Services
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div key={service.title} className="flex items-start gap-4 p-4 bg-secondary/30 dark:bg-slate-700 rounded-lg">
              <service.icon className="h-8 w-8 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-primary">{service.title}</h3>
                <p className="text-sm text-foreground/80">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
