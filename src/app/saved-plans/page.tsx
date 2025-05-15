
"use client";

import type * as React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { SavedPlan } from '@/types/wanderwise';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Library, MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function SavedPlansPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.replace('/auth/login');
    } else if (currentUser) {
      try {
        const plansFromStorage = localStorage.getItem('wanderwise_saved_plans_array');
        if (plansFromStorage) {
          const parsedPlans: SavedPlan[] = JSON.parse(plansFromStorage);
          // Sort plans by timestamp, newest first
          parsedPlans.sort((a, b) => b.timestamp - a.timestamp);
          setSavedPlans(parsedPlans);
        }
      } catch (error) {
        console.error("Error loading saved plans from localStorage:", error);
        // Potentially set an error state to show to the user
      }
      setIsLoadingPlans(false);
    }
  }, [currentUser, authLoading, router]);

  if (authLoading || isLoadingPlans) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><LoadingSpinner text="Loading your saved plans..." /></div>;
  }

  if (!currentUser) {
    // This case should ideally be handled by the redirect, but as a fallback
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><p>Please log in to view your saved plans.</p></div>;
  }

  return (
    <div className="py-8">
      <Card className="w-full max-w-4xl mx-auto shadow-xl bg-card">
        <CardHeader className="text-center border-b pb-4">
          <Library className="mx-auto h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-3xl font-bold">My Saved Plans</CardTitle>
          <CardDescription>Here are all the amazing trips you've planned with WanderWise.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {savedPlans.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl text-muted-foreground mb-4">You haven't saved any plans yet.</p>
              <Button asChild>
                <Link href="/">Plan a New Trip</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {savedPlans.map((plan) => (
                <Card key={plan.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="bg-secondary/30">
                    <CardTitle className="text-xl text-primary flex items-center gap-2">
                      <MapPin className="h-5 w-5 flex-shrink-0" /> 
                      {plan.finalDestinationCityToDisplay || plan.suggestedCity?.suggestedCity || "Unnamed Plan"}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-sm pt-1">
                      <Calendar className="h-4 w-4" />
                      Saved on: {new Date(plan.timestamp).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-3">
                    {plan.itineraryData?.itinerary?.length ? (
                       <p className="text-sm text-muted-foreground">
                         A {plan.itineraryData.itinerary.length}-day adventure awaits!
                       </p>
                    ): (
                       <p className="text-sm text-muted-foreground">
                         City suggestion with details.
                       </p>
                    )}
                  </CardContent>
                  <CardFooter className="bg-muted/30 p-4">
                    <Button asChild variant="default" size="sm" className="w-full">
                      <Link href={`/saved-plans/${plan.id}`}>
                        View Full Plan <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
