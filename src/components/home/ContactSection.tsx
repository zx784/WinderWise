
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
// For a real contact form, you might create a separate component and possibly a Genkit flow.
// For now, this is a simple display.

export default function ContactSection() {
  return (
    <Card className="w-full bg-white dark:bg-slate-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
          <Mail className="h-7 w-7" /> Contact Us
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-foreground/80">
        <p>
          Have questions or feedback? We&apos;d love to hear from you!
        </p>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-accent" />
          <span>support@wanderwise.app (Placeholder)</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-accent" />
          <span>+1 (555) 123-4567 (Placeholder)</span>
        </div>
        <p className="text-sm text-muted-foreground">
          For a full contact form implementation, consider creating a dedicated component.
          Genkit could be used to process form submissions if AI-driven routing or analysis is needed.
        </p>
      </CardContent>
    </Card>
  );
}
