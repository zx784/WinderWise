
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import Image from "next/image";

// Placeholder data for team members
const teamMembers = [
  {
    name: "Alice Wonderland",
    role: "Chief Visionary Officer",
    imageUrl: "https://placehold.co/300x300.png",
    bio: "Alice dreams up the future of travel, ensuring every journey is magical.",
    dataAiHint: "professional woman"
  },
  {
    name: "Bob The Builder",
    role: "Lead AI Architect",
    imageUrl: "https://placehold.co/300x300.png",
    bio: "Bob constructs the intelligent systems that power WanderWise.",
    dataAiHint: "professional man"
  },
  {
    name: "Carol Traveler",
    role: "Head of User Experience",
    imageUrl: "https://placehold.co/300x300.png",
    bio: "Carol ensures that WanderWise is intuitive and delightful to use.",
    dataAiHint: "person smiling"
  },
];

export default function OurTeamSection() {
  return (
    <Card className="w-full bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary flex items-center gap-3">
          <Users className="h-8 w-8" />
          Meet Our Team
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <p className="text-lg text-foreground/80">
          We are a passionate group of innovators, designers, and travel enthusiasts dedicated to making your
          adventures unforgettable. (Placeholder text)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.name} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-56 w-full">
                <Image
                  src={member.imageUrl}
                  alt={`Photo of ${member.name}`}
                  fill
                  style={{ objectFit: "cover" }}
                  data-ai-hint={member.dataAiHint}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-accent">{member.name}</CardTitle>
                <p className="text-sm font-medium text-primary">{member.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
