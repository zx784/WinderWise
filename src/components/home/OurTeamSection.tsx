
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import Image from "next/image";

const teamMembers = [
  {
    name: "Faisal Karissan",
    role: "Aspiring Data Scientist & Backend Developer",
    imageUrl: "/images/faisal-karissan.jpg",
    bio: "Faisal is passionate about leveraging data and building robust backend systems.",
    dataAiHint: "professional man",
  },
  {
    name: "Monsur Shukla",
    role: "Frontend Developer",
    imageUrl: "/images/monsur-shukla.jpg",
    bio: "Monsur focuses on creating intuitive and engaging user interfaces.",
    dataAiHint: "developer coding",
  },
  {
    name: "Abdul Karim Bawazir",
    role: "UI/UX Developer",
    imageUrl: "/images/abdulkarim-bawazir.jpg",
    bio: "AbdulKarim designs seamless and user-centered experiences.",
    dataAiHint: "designer thinking",
  },
  {
    name: "Amruish Sharafi",
    role: "Frontend Developer",
    imageUrl: "/images/amruish-sharafi.jpg",
    bio: "Amruish brings designs to life with clean and efficient frontend code.",
    dataAiHint: "person computer",
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
          adventures unforgettable.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {teamMembers.map((member) => (
            <Card
              key={member.name}
              className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={member.imageUrl || "/images/fallback.jpg"} // Fallback image
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
