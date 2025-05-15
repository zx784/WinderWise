
"use client";

import type { SuggestCityOutput } from "@/ai/flows/intelligent-city-suggestion";
import type { GenerateItineraryOutput } from "@/ai/flows/ai-itinerary-generation";
import SuggestedCityCard from "./SuggestedCityCard";
import ItineraryView from "./ItineraryView";
import CostBreakdownDisplay from "./CostBreakdownDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, Save, Download, Share2, Copy, MessageCircle, Send, Settings2 } from "lucide-react";
import PlaceCard from "./PlaceCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';

interface ResultsDisplayProps {
  suggestedCity?: SuggestCityOutput;
  itineraryData?: GenerateItineraryOutput;
  uploadedImageFileName?: string;
  finalDestinationCityToDisplay?: string;
}

export default function ResultsDisplay({
  suggestedCity,
  itineraryData,
  uploadedImageFileName,
  finalDestinationCityToDisplay,
}: ResultsDisplayProps) {
  const { toast } = useToast();

  const getDestinationForText = (): string | undefined => {
    return suggestedCity?.suggestedCity || finalDestinationCityToDisplay;
  };

  const formatTripDataForText = (concise: boolean = false): string => {
    let content = "";
    const destination = getDestinationForText();

    if (concise) {
      content = "Check out my WanderWise travel plan!\n";
      if (destination) {
        content += `Destination: ${destination}\n`;
      }
      if (itineraryData?.itinerary && itineraryData.itinerary.length > 0) {
        content += `Duration: ${itineraryData.itinerary.length} day(s)\n`;
        const highlights = itineraryData.itinerary
          .slice(0, 2) 
          .flatMap(day => day.activities.slice(0, 1).map(act => act.description)) 
          .join('; ');
        if (highlights) content += `Highlights: ${highlights}...\n`;
      }
      return content;
    }

    content = "WanderWise Trip Plan\n\n";
    if (destination) {
      content += `Destination: ${destination}\n`;
    }
    if (suggestedCity?.justification) {
      content += `Why this city? ${suggestedCity.justification}\n`;
    }
    content += "\n";

    if (itineraryData?.itinerary && itineraryData.itinerary.length > 0) {
      content += "--- ITINERARY ---\n";
      itineraryData.itinerary.forEach(day => {
        content += `Day ${day.day}:\n`;
        day.activities.forEach(activity => {
          content += `- ${activity.description}`;
          if (activity.time) {
            content += ` (${activity.time})`;
          }
          content += "\n";
          if (activity.alternatives && activity.alternatives.length > 0) {
            content += `  Alternatives: ${activity.alternatives.join(", ")}\n`;
          }
        });
        content += "\n";
      });
    }

    if (itineraryData?.costBreakdown) {
      content += "--- COST BREAKDOWN ---\n";
      const { accommodation, food, transportation, activities } = itineraryData.costBreakdown;
      if (accommodation) content += `Accommodation: ${accommodation}\n`;
      if (food) content += `Food: ${food}\n`;
      if (transportation) content += `Transportation: ${transportation}\n`;
      if (activities) content += `Activities: ${activities}\n`;
      content += "\n";
    }
    return content;
  };

  const handleSavePlan = () => {
    if (!itineraryData && !suggestedCity) {
      toast({ title: "Nothing to save", description: "Generate a plan first.", variant: "destructive" });
      return;
    }
    localStorage.setItem('wanderwise_saved_trip', JSON.stringify({ suggestedCity, itineraryData, finalDestinationCityToDisplay }));
    toast({ title: "Trip Saved!", description: "Your trip plan has been saved in your browser." });
  };

  const handleDownloadPlan = () => {
    if (!itineraryData && !suggestedCity) {
      toast({ title: "Nothing to download", description: "Generate a plan first.", variant: "destructive" });
      return;
    }
    const textContent = formatTripDataForText(false);
    const fileNameDestination = getDestinationForText()?.replace(/\s+/g, '_') || "Trip";
    
    try {
      const doc = new jsPDF();
      // Set metadata (optional)
      doc.setProperties({
        title: `WanderWise Plan: ${fileNameDestination}`,
        subject: 'Personalized Travel Itinerary',
        author: 'WanderWise App',
      });

      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 15; // mm
      let y = margin;
      const lineHeight = 7; // mm, adjust as needed for font size

      // Split text into lines that fit the page width
      const lines = doc.splitTextToSize(textContent, pageWidth - (margin * 2));

      lines.forEach((line: string) => {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin; // Reset y for new page
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
      
      doc.save(`WanderWise_Plan_${fileNameDestination}.pdf`);
      toast({ title: "Download Started", description: "Your trip plan PDF is downloading." });

    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast({ title: "PDF Generation Failed", description: "Could not generate PDF. Please try again.", variant: "destructive" });
    }
  };

  const handleShare = (platform: 'whatsapp' | 'telegram') => {
    if (!itineraryData && !suggestedCity) {
      toast({ title: "Nothing to share", description: "Generate a plan first.", variant: "destructive" });
      return;
    }
    const shareText = formatTripDataForText(true); 
    const encodedText = encodeURIComponent(shareText);
    let shareUrl = "";

    if (platform === 'whatsapp') {
      shareUrl = `https://wa.me/?text=${encodedText}`;
    } else if (platform === 'telegram') {
      const encodedPageUrl = encodeURIComponent(window.location.href);
      shareUrl = `https://t.me/share/url?url=${encodedPageUrl}&text=${encodedText}`;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyToClipboard = () => {
    if (!itineraryData && !suggestedCity) {
      toast({ title: "Nothing to copy", description: "Generate a plan first.", variant: "destructive" });
      return;
    }
    const textToCopy = formatTripDataForText(false); 
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({ title: "Copied to Clipboard!", description: "You can now paste the plan." });
    }).catch(err => {
      console.error("Failed to copy: ", err);
      toast({ title: "Copy Failed", description: "Could not copy to clipboard.", variant: "destructive" });
    });
  };
  
  if (!suggestedCity && !itineraryData) {
    return null;
  }

  const allActivities = itineraryData?.itinerary.flatMap(day => day.activities) || [];
  const uniqueActivityDescriptions = new Set<string>();
  const uniqueActivities = allActivities.filter(activity => {
    if (uniqueActivityDescriptions.has(activity.description)) {
      return false;
    }
    uniqueActivityDescriptions.add(activity.description);
    return true;
  });

  const canPerformActions = itineraryData || suggestedCity;

  return (
    <div className="space-y-8 mt-12">
      {suggestedCity && suggestedCity.suggestedCity && (
        <SuggestedCityCard suggestion={suggestedCity} />
      )}

      {uploadedImageFileName && (
         <Card className="w-full bg-secondary/30 shadow-lg">
         <CardHeader>
           <CardTitle className="text-2xl font-semibold text-primary">Uploaded Image</CardTitle>
         </CardHeader>
         <CardContent>
           <p>You uploaded: <span className="font-medium">{uploadedImageFileName}</span>.</p>
           <p className="text-sm text-muted-foreground mt-1">AI-powered place recognition and suggestions based on this image are a planned future enhancement.</p>
         </CardContent>
       </Card>
      )}

      {itineraryData && (
        <>
          <ItineraryView itineraryData={itineraryData} />
          <CostBreakdownDisplay costBreakdown={itineraryData.costBreakdown} />
          
          {uniqueActivities.length > 0 && (
            <Card className="w-full shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
                  <Map className="h-7 w-7" />
                  Key Places & Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {uniqueActivities.map((activity, index) => (
                  <PlaceCard key={`place-${index}`} activity={activity} />
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {canPerformActions && (
        <Card className="w-full shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
              <Settings2 className="h-7 w-7" /> Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row flex-wrap gap-4">
            <Button onClick={handleSavePlan} variant="outline" className="flex-grow sm:flex-grow-0">
              <Save className="mr-2 h-4 w-4" /> Save Plan
            </Button>
            <Button onClick={handleDownloadPlan} variant="outline" className="flex-grow sm:flex-grow-0">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
            <Button onClick={() => handleShare('whatsapp')} variant="outline" className="flex-grow sm:flex-grow-0">
              <MessageCircle className="mr-2 h-4 w-4" /> Share on WhatsApp
            </Button>
            <Button onClick={() => handleShare('telegram')} variant="outline" className="flex-grow sm:flex-grow-0">
              <Send className="mr-2 h-4 w-4" /> Share on Telegram
            </Button>
            <div className="flex flex-col gap-2 flex-grow sm:flex-grow-0">
                <Button onClick={handleCopyToClipboard} variant="outline">
                    <Copy className="mr-2 h-4 w-4" /> Copy for Instagram & Others
                </Button>
                <p className="text-xs text-muted-foreground max-w-xs">
                    Instagram doesn't support direct text sharing. Copy the plan and paste it into your post.
                </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
